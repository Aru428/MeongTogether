import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./signin.module.scss";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/action/nicknameAction";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigator = useNavigate();
  const dispatch = useDispatch();

  const onValid = (data) => {
    console.log(process.env.REACT_APP_HOST, data);
    axios
      .post(
        `${process.env.REACT_APP_HOST}/user/signin`,
        {
          user_id: data.user_id,
          password: data.password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res.data);

        if (res.data.result) {
          dispatch(loginSuccess(res.data));
          navigator("/"); // home으로 이동
        } else {
          alert("로그인에 실패하였습니다.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("error!");
      });
  };

  const onInvalid = (err) => {
    console.log("로그인 실패", err);
  };

  return (
    <>
      <div className={styles.container}>
        <p>로그인</p>

        <form
          onSubmit={handleSubmit(onValid, onInvalid)}
          className={styles.form}
        >
          <div className={`${styles.divisionLine}`}></div>
          <div className={`${styles.formGroup} ${styles.id}`}>
            <input
              type="text"
              id="user_id"
              placeholder="아이디를 입력해주세요"
              {...register("user_id", {
                required: "아이디를 입력해 주세요",
              })}
            />
            {errors.user_id && (
              <small role="alert" className={styles.error}>
                {errors.user_id.message}
              </small>
            )}
          </div>

          <div className={`${styles.formGroup} ${styles.pw}`}>
            <input
              type="password"
              placeholder="비밀번호를 입력해주세요"
              {...register("password", {
                required: "비밀번호를 입력해 주세요",
              })}
            />
            {errors.password && (
              <small role="alert" className={styles.error}>
                {errors.password.message}
              </small>
            )}
          </div>

          <button
            type="submit"
            className={`${styles.formGroup} ${styles.btn} ${styles.btnSignin}`}
          >
            로그인
          </button>

          <button
            onClick={() => navigator("/user/signup")}
            className={`${styles.formGroup} ${styles.btn} ${styles.btnSignup}`}
          >
            회원가입
          </button>
        </form>
      </div>
    </>
  );
}
