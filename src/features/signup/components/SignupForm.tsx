import React, { useEffect, useState } from "react";
import Flex from "../../../components/Flex";
import { useEmailValidation } from "../hooks/useEmailValidation";
import { useNicknameValidation } from "../hooks/useNicknameValidation";
import { usePasswordCheck } from "../hooks/usePasswordCheck";
import { useSignup } from "../hooks/useSignup";

import { useNavigate } from "react-router-dom";
import { getCookie } from "../../../utils/cookies";
import InputList from "../../mypage/components/InputList";
import { MyPageInput } from "../../mypage/styles/MypageStyle";
import SignupTitle from "../../../assets/Texts/Signup.svg";
import Button from "../../../components/Button";
import { SignInfo } from "../../../data/type/type";
import * as St from "../styles/SignupFormStyle";
import {
  ButtonBox,
  Form,
  FormTitle,
  FormWrapper,
} from "../../login/styles/LoginFormStyle";

const SignupForm = () => {
  const navigate = useNavigate();
  const token = getCookie("token");
  const [signInfo, setSignInfo] = useState<SignInfo>({
    email: "",
    nickname: "",
    password: "",
  });

  const [checkPassword, setCheckPassword] = useState<string>("");

  const { validEmail, checkEmail, emailValidation, setEmailValidation } =
    useEmailValidation();
  const {
    validNickname,
    checkNickname,
    nicknameValidation,
    setNicknameValidation,
  } = useNicknameValidation();
  const { validPassword, checkPasswordHandler } = usePasswordCheck(
    signInfo.password
  );
  const { signup } = useSignup();

  const changeInputHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target;
    setSignInfo({ ...signInfo, [name]: value });
    if (name === "nickname") {
      setNicknameValidation(false);
      setSignInfo({ ...signInfo, [name]: value });
    }
    if (name === "email") {
      setEmailValidation(false);
      setSignInfo({ ...signInfo, [name]: value });
    }
  };

  const checkPasswordChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setCheckPassword(value);
  };

  const checkEmailHandler = (item: string) => {
    if (validEmail(item)) {
      checkEmail.mutate(item);
    } else {
      setSignInfo({ ...signInfo, email: "" });
      setEmailValidation(false);
      alert("이메일 형식에 맞게 입력해주세요.");
    }
  };

  const checkNicknameHandler = (item: string) => {
    if (validNickname(item)) {
      checkNickname.mutate(item);
    } else {
      setSignInfo({ ...signInfo, nickname: "" });
      setNicknameValidation(false);
      alert("8글자 이하로 입력해주세요.");
    }
  };

  const submitInfoHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      emailValidation &&
      nicknameValidation &&
      validPassword(signInfo.password)
    ) {
      signup.mutate(signInfo);
    } else {
      alert("입력한 내용을 확인해주세요 !");
    }
  };
  useEffect(() => {
    if (token) {
      navigate("/");
    }
    const preventGoBack = () => {
      if (window.confirm("페이지를 나가시겠습니까?")) {
        navigate(-1);
      } else {
        window.history.pushState(null, "", window.location.href);
      }
    };

    // 새로고침 막기 변수
    const preventClose = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", preventGoBack);
    window.addEventListener("beforeunload", preventClose);
    return () => {
      window.removeEventListener("popstate", preventGoBack);
      window.removeEventListener("beforeunload", preventClose);
    };
  }, [token]);

  return (
    <FormWrapper>
      <Form onSubmit={submitInfoHandler}>
        <Flex>
          <FormTitle url={SignupTitle} size={6} />
          <InputList name="이메일">
            <St.SignFormContentBox>
              <MyPageInput
                type="text"
                name="email"
                value={signInfo.email}
                maxLength={25}
                onChange={changeInputHandler}
              />
              <Button
                type="button"
                onClick={() => checkEmailHandler(signInfo.email)}
                disabled={emailValidation}
              >
                중복확인
              </Button>
              {signInfo.email ? (
                emailValidation ? (
                  <span>사용할 수 있는 아이디입니다.</span>
                ) : (
                  <St.WarningMessage>중복확인이 필요합니다.</St.WarningMessage>
                )
              ) : (
                <St.WarningMessage>
                  이메일 형식으로 입력해주세요.
                </St.WarningMessage>
              )}
            </St.SignFormContentBox>
          </InputList>
          <InputList name="닉네임">
            <St.SignFormContentBox>
              <MyPageInput
                type="text"
                name="nickname"
                value={signInfo.nickname}
                maxLength={8}
                onChange={changeInputHandler}
              />
              <Button
                type="button"
                onClick={() => checkNicknameHandler(signInfo.nickname)}
                disabled={nicknameValidation}
              >
                중복확인
              </Button>
              {signInfo.nickname ? (
                nicknameValidation ? (
                  <span>사용할 수 있는 닉네임입니다.</span>
                ) : (
                  <St.WarningMessage>중복확인이 필요합니다.</St.WarningMessage>
                )
              ) : (
                <span></span>
              )}
            </St.SignFormContentBox>
          </InputList>
          <InputList name="비밀번호">
            <St.SignFormContentBox>
              <MyPageInput
                type="password"
                name="password"
                value={signInfo.password}
                maxLength={15}
                onChange={changeInputHandler}
              />
              {7 < Number(signInfo.password.length) ? null : (
                <St.WarningMessage>
                  영소문자, 숫자를 포함하는 8~15자리이어야합니다.
                </St.WarningMessage>
              )}
            </St.SignFormContentBox>
          </InputList>
          <InputList name="비밀번호 확인">
            <St.SignFormContentBox>
              <MyPageInput
                type="password"
                value={checkPassword}
                maxLength={15}
                onChange={checkPasswordChangeHandler}
              />
              {checkPassword ? (
                checkPasswordHandler(checkPassword) ? (
                  <span>비밀번호가 일치합니다.</span>
                ) : (
                  <St.WarningMessage>
                    비밀번호가 일치하지 않습니다.
                  </St.WarningMessage>
                )
              ) : (
                <span>비밀번호를 다시 입력해주세요.</span>
              )}
            </St.SignFormContentBox>
          </InputList>
          <ButtonBox>
            <Button size="large" type="submit">
              가입하기
            </Button>
          </ButtonBox>
        </Flex>
      </Form>
    </FormWrapper>
  );
};

export default SignupForm;
