// 이태건: 로그인 페이지
import { useEffect } from "react";

const Login = () => {
  const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY;
  useEffect(() => {
    // 1. 카카오 SDK가 로드되었는지 확인
    if (window.Kakao) {
      // 2. 이미 초기화되었는지 확인 후 초기화
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey);
        console.log("Kakao SDK initialized");
      }
    } else {
      // 3. 만약 window.Kakao가 아직 없다면..
      console.error(
        "No Kakao SDK found in index.html. Please check your index.html file."
      );
    }
  }, [kakaoKey]);

  const handleKakaoLogin = () => {
    // SDK가 로드되고 초기화되었는지 확인
    if (!window.Kakao) {
      console.error("Kakao SDK not loaded.");
      alert("Kakao SDK is loading. Please try again later.");
      return;
    }

    if (!window.Kakao.isInitialized()) {
      console.error("Kakao SDK not initialized.");
      alert("Kakao SDK is initializing. Please try again later.");
      return;
    }

    // 카카오 SDK 2.7.9에서는 authorize() 메서드만 사용 가능 (리다이렉트 방식)
    // redirectUri는 카카오 개발자 콘솔에 등록된 URI와 정확히 일치해야 함
    const redirectUri = `${window.location.origin}/login/kakao/callback`;

    // authorize()는 리다이렉트를 수행하므로, 콜백 페이지에서 처리
    window.Kakao.Auth.authorize({
      redirectUri: redirectUri,
    });
  };

  return (
    <div className="min-h-screen bg-white pb-20 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* 로그인 헤더 */}
        <div className="mb-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-1.5 tracking-tight">
            로그인
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            서비스 이용을 위해 로그인해주세요
          </p>
        </div>

        {/* 로그인 박스 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* 카카오 로그인 버튼 */}
          <button
            onClick={handleKakaoLogin}
            className="w-full bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-gray-900 font-bold py-4 px-6 rounded-xl 
            flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
          >
            {/* 카카오 심볼 아이콘 */}
            <svg
              viewBox="0 0 32 32"
              width="24"
              height="24"
              fill="currentColor"
              className="flex-shrink-0"
            >
              <path d="M16 4C8.832 4 3 8.604 3 14.28c0 3.73 2.536 7.025 6.36 8.797l-1.306 4.81c-.13.48.44.857.818.59l5.59-3.95c.502.05 1.015.074 1.538.074 7.168 0 13-4.604 13-10.28C29 8.604 23.168 4 16 4z" />
            </svg>
            <span className="text-base">카카오로 시작하기</span>
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          카카오 계정으로 간편하게 시작하세요
        </p>
      </div>
    </div>
  );
};

export default Login;
