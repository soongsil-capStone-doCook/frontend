// 천재민: 영수증 촬영 및 인식 페이지
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fridgeAPI } from "../../api/fridge";
import { FaCamera, FaCloudUploadAlt } from "react-icons/fa";
import { HiX } from "react-icons/hi";

const Receipt = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraMode, setCameraMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // 카메라 시작
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // 후면 카메라 우선
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraMode(true);
      }
    } catch (err) {
      console.error("카메라 접근 실패:", err);
      setError("카메라 접근에 실패했습니다. 파일 업로드를 사용해주세요.");
    }
  };

  // 카메라 중지
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraMode(false);
  };

  // 카메라로 촬영
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], "receipt.jpg", {
              type: "image/jpeg",
            });
            setImage(file);
            setImagePreview(URL.createObjectURL(blob));
            stopCamera();
          }
        },
        "image/jpeg",
        0.9
      );
    }
  };

  // 파일 선택
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 이미지 제거
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // OCR 실행
  const handleRecognize = async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fridgeAPI.recognizeReceipt(image);
      // OCR 결과를 받으면 결과 페이지로 이동
      navigate("/receipt/result", {
        state: {
          ocrResults: response.data,
          imagePreview: imagePreview,
        },
      });
    } catch (err) {
      console.error("OCR 인식 실패:", err);
      setError("영수증 인식에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 언마운트 시 카메라 정리
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">영수증 인식</h1>
          <p className="text-sm text-gray-600">
            영수증을 촬영하거나 업로드하여 재료를 자동으로 인식하세요
          </p>
        </div>

        {/* 이미지 업로드 영역 */}
        {!imagePreview && !cameraMode && (
          <div className="space-y-6 mb-6">
            {/* 드롭존 */}
            <div
              ref={dropZoneRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-slate-500 bg-slate-100 scale-105"
                  : "border-gray-300 bg-white hover:border-slate-400 hover:bg-gray-50"
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <FaCloudUploadAlt className="text-slate-600 text-3xl" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900 mb-1">
                    영수증 이미지를 드래그하거나 클릭하세요
                  </p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG 형식의 이미지를 업로드할 수 있습니다
                  </p>
                </div>
              </div>
            </div>

            {/* 구분선 */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-sm text-gray-500 font-medium">또는</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* 카메라 버튼 */}
            <button
              onClick={startCamera}
              className="w-full py-3 bg-gray-700 text-white rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-gray-800 transition-colors"
            >
              <FaCamera className="text-lg" />
              <span>카메라로 촬영하기</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {/* 카메라 미리보기 */}
        {cameraMode && (
          <div className="mb-6">
            <div className="relative bg-black rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto"
              />
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 bg-gray-800/80 text-white rounded-full backdrop-blur-sm"
                >
                  취소
                </button>
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 bg-white rounded-full border-4 border-gray-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* 이미지 미리보기 */}
        {imagePreview && (
          <div className="mb-6">
            <div className="relative bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={imagePreview}
                alt="영수증 미리보기"
                className="w-full h-auto"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <HiX className="text-lg" />
              </button>
            </div>

            <button
              onClick={handleRecognize}
              disabled={isLoading}
              className="w-full mt-4 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "인식 중..." : "영수증 인식하기"}
            </button>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Receipt;
