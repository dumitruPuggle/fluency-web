import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useFormik } from "formik";
import React, { SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { Prompt, useHistory } from "react-router-dom";
import * as Yup from "yup";
import NativeButton from "../../../../components/Buttons/NativeButton";
import Indicator from "../../../../components/Indicator/Indicator";
import StrengthBox from "../../../../components/StrengthBox/StrengthBox";
import { signUpSession4 } from "../../../../service/Auth/Creator/endpoints";
import { routes } from "../../../../service/internal-routes";

interface IPasswordServiceProps {
  state: [object, Function]
  submitToken: string
  indicator?: {
    value: number;
    counts: number;
  };
}

function PasswordService({ indicator, state, submitToken }: IPasswordServiceProps) {
  const history = useHistory()
  const [leaveDialog, setLeaveDialog] = useState(false);
  const { t } = useTranslation();

  const [passwordState, setState] = state;

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: Yup.object({}),
    onSubmit: async function (values) {
      setState({ ...passwordState, password: values.password });
      console.log(submitToken)
      try {
        await signUpSession4({password: values.password}, {_temptoken: submitToken});
        history.push(`${routes.SignUp}/${routes.SignUpSteps.finish}`);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <form className="form-global" onSubmit={formik.handleSubmit}>
      <Prompt
        message={(location, action) => {
          if (action === "POP") {
            setLeaveDialog(!leaveDialog);
          }
          return false;
        }}
      />
      <Dialog
        title={t('areYouSureToCancel')}
        open={leaveDialog}
        onClose={() => setLeaveDialog(false)}
      >
        <DialogTitle title={t('areYouSureToCancel')}>
          {t('areYouSureToCancel')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('areYouSureToCancelDescription')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.location.pathname = "/"} autoFocus>
            {t("yes")}
          </Button>
        </DialogActions>
      </Dialog>
      <h4 className="mb-4 form-title">{t("createPassword")}</h4>
      {indicator && (
        <Indicator
          className="mb-4"
          value={indicator?.value}
          counts={indicator?.counts}
        />
      )}
      <StrengthBox
        className="mb-4"
        password={formik.values.password}
        firstName={""}
        lastName={""}
      />
      <TextField
        helperText={formik.errors.password}
        variant="filled"
        label={t("password")}
        name="password"
        className="mb-3"
        type="password"
        error={formik.errors.password && formik.touched.password ? true : false}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
      />
      <NativeButton className="mt-3" type="submit" title={t("createAccount")} />
      <hr />
      <small className="w-100 form-disclaimer">
        {t("disclaimerVerification")}
      </small>
    </form>
  );
}

export default PasswordService;
