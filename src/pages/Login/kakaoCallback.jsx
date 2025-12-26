import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authAPI } from "../../api/auth";
import { useUserStore } from "../../store/useUserStore";

const KakaoCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setIsLoggined, setUser } = useUserStore();

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
        // 3. redirectUri 생성 (카카오 인증 시 사용한 것과 동일해야 함)
        const redirectUri = `${window.location.origin}/login/kakao/callback`;
        
        // 4. 백엔드로 code와 redirectUri 전송
        const response = await authAPI.kakaoLogin(code, redirectUri);

        // 4. 응답에서 데이터 추출
        const data = response.data;

        console.log("=== 카카오 로그인 응답 ===");
        console.log("전체 응답 데이터:", data);
        console.log("isNewMember:", data.isNewMember);
        console.log("user:", data.user);

        // 5. 서버에서 받은 accessToken 저장 (카카오 인증 코드가 아닌 서버 토큰)
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          console.log("✅ accessToken 저장 완료");
        }
        
        // refreshToken도 저장 (선택사항)
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }

        setIsLoggined(true);
        setUser(data.user);

        // 6. 페이지 이동 - 최초 회원가입이면 온보딩 페이지로, 아니면 메인 페이지로
        if (data.isNewMember) {
          console.log("신규 회원 → 온보딩 페이지로 이동");
          navigate("/onboarding");
        } else {
          console.log("기존 회원 → 메인 페이지로 이동");
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
