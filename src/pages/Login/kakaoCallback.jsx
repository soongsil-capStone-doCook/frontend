import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authAPI } from "../../api/auth";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL에서 code 추출
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  useEffect(() => {
    const handleCallback = async () => {
      // 1. 에러 확인
      if (error) {
        console.error("카카오 로그인 에러:", error);
        alert("카카오 로그인에 실패했습니다.");
        navigate("/login");
        return;
      }

      // 2. code가 없으면 에러 처리
      if (!code) {
        console.error("인증 코드를 받지 못했습니다.");
        alert("인증 코드를 받지 못했습니다.");
        navigate("/login");
        return;
      }

      try {
        // 3. 백엔드로 code 전송
        const response = await authAPI.kakaoLogin(code);

        // 4. 응답에서 데이터 추출
        const data = response.data;

        console.log("백엔드 로그인 성공:", data);

        // 5. 토큰 저장
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);

        // 6. 페이지 이동
        if (data.isNewMember) {
          navigate("/signup-info");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("백엔드 로그인 에러:", error);
        alert("로그인 처리 중 문제가 발생했습니다.");
        navigate("/login");
      }
    };

    handleCallback();
  }, [code, error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <p className="text-gray-600">카카오 로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default KakaoCallback;
