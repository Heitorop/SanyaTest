import { SyntheticEvent, useEffect, useRef, useState } from "react";
import {
  mdiTrayArrowUp,
  mdiCheckBold,
  mdiClose,
  mdiPlus,
  mdiMinus,
} from "@mdi/js";
import { ClipLoader } from "react-spinners";
import Icon from "@mdi/react";
import ErrorImg from "../../assets/sadFace.svg";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import "react-image-crop/src/ReactCrop.scss";
import "./ImgUploader.scss";
import { Slider } from "@mui/material";
import { setCanvas } from "../../setCanvas";

enum ErrorType {
  None = "None",
  ImageFormat = "ImageFormat",
  ImageSize = "ImageSize",
  ImageResolution = "ImageResolution",
  Other = "Other",
}

type ErrorState = {
  type: ErrorType;
  message: string;
};

const ASPECT_RATION = 1;
const MIN_DIMENSION = 150;

const ImgUploader = () => {
  const [avatarImg, setAvatarImg] = useState<string>();
  const [isUploaded, setIsUploaded] = useState(false);
  const [showSucceed, setShowSucceed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<ErrorState>({
    type: ErrorType.None,
    message: "",
  });

  const [crop, setCrop] = useState<Crop>();
  const [zoom, setZoom] = useState(1);

  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fileUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isUploaded) {
      setShowSucceed(true);

      setTimeout(() => {
        setShowSucceed(false);
      }, 800);
    }
  }, [isUploaded]);
  const handleImgUpload = (e: SyntheticEvent): void => {
    e.preventDefault();
    fileUploadRef.current?.click();
  };

  const uploadImage = () => {
    setIsUploaded(false);
    setIsError({ type: ErrorType.None, message: "" });
    setIsLoading(true);
    const file = fileUploadRef.current?.files?.[0];
    if (file) {
      const cachedURL = URL.createObjectURL(file);

      // SIZE VALIDATION
      if (file.size > 20 * 1024 * 1024) {
        setIsError({
          type: ErrorType.ImageSize,
          message: "Завеликий розмір файлу ",
        });
        setIsLoading(false);
        return;
      }

      const img = new Image();
      img.src = cachedURL;

      img.onload = () => {
        const width = img.width;
        const height = img.height;
        // Check if the image dimensions are within the specified range
        if (width < 200 || height < 200 || width > 8192 || height > 8192) {
          setIsError({
            type: ErrorType.ImageResolution,
            message: "Resolution",
          });
          setIsLoading(false);
          return;
        }

        // If all checks pass, set the avatarImg state with the image URL
        setAvatarImg(cachedURL);
        setIsLoading(false);
      };
    }
  };

  const cropHandler = (e: SyntheticEvent) => {
    const { width, height } = e.currentTarget as HTMLImageElement;
    const cropWidthPercent = (MIN_DIMENSION / width) * 100;
    console.log(cropWidthPercent);
    const crop = makeAspectCrop(
      { unit: "%", width: cropWidthPercent },
      ASPECT_RATION,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  return (
    <div className="uploader">
      {isError.type !== ErrorType.None && (
        <div className="uploader_error" onClick={handleImgUpload}>
          <div>
            <img src={ErrorImg} alt="error" />
            <p>{isError.message}</p>
          </div>
          <div className="uploader_settings">
            <div className="uploader_settings_description">
              <Icon path={mdiTrayArrowUp} size={1} />
              <p>Завантажити інше зображення</p>
            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="uploader_loader">
          <ClipLoader color="#D7E2E9" />
          <p>Завантаження зображення</p>
        </div>
      )}
      {showSucceed && (
        <div className="uploader_succeed">
          <Icon path={mdiCheckBold} size={2} />
        </div>
      )}
      {isUploaded && (
        <img src={avatarImg} alt="avatar" className="uploader_img" />
      )}
      {avatarImg && isError.type === ErrorType.None && !isUploaded ? (
        <div className="uploader_crop">
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            aspect={ASPECT_RATION}
            minHeight={MIN_DIMENSION}
            keepSelection
          >
            <img
              ref={imgRef}
              src={avatarImg}
              alt="camera-icon"
              className="uploader_crop_img"
              onLoad={cropHandler}
              style={{
                width: "100%",
                height: "100%",
                transform: `scale(${zoom})`,
              }}
            />
          </ReactCrop>
          <div className="uploader_settings">
            <div onClick={() => setAvatarImg("")}>
              <Icon path={mdiClose} color="#707E93" size={1} />
            </div>
            <div className="slider-wrapper">
              <Icon path={mdiMinus} color="#000000" size={1} />
              <Slider
                size="small"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e: Event, zoom: number | number[]) =>
                  setZoom(Number(zoom))
                }
              />
              <Icon path={mdiPlus} color="#000000" size={1} />
            </div>
            <div
              onClick={() => {
                if (imgRef.current && canvasRef.current && crop) {
                  setCanvas(
                    imgRef.current,
                    canvasRef.current,
                    convertToPixelCrop(
                      crop,
                      imgRef.current?.width,
                      canvasRef.current?.width
                    ),
                    zoom
                  );
                  const dataUrl = canvasRef.current.toDataURL();
                  setAvatarImg(dataUrl);
                  setIsUploaded(true);
                }
              }}
            >
              <Icon path={mdiCheckBold} color="#000000" size={1} />
            </div>
          </div>
        </div>
      ) : (
        <form id="form" encType="multipart/form-data" className={`uploader_form ${isUploaded ? "uploader_form--uploaded" : ""}`}>
          <div className="uploader_settings">
            <div className="uploader_settings_description">
              {!isUploaded ? (
                <Icon path={mdiTrayArrowUp} size={1} />
              ) : (
                <p className="uploader_settings_description-title" onClick={handleImgUpload}>
                  Змінити фото
                </p>
              )}
              <p>
                Обличчя. До 20МБ 200*200 - 8192*8192px jpeg, jpg, png, heic,
                heif
              </p>
            </div>
          </div>
          <button type="submit" onClick={handleImgUpload} />
          <input
            ref={fileUploadRef}
            type="file"
            name="avatarUploader"
            id="avatar-1"
            hidden
            accept="image/jpeg,image/jpg, image/png, image/heic, image/heif"
            onChange={uploadImage}
            className="uploader_input"
          />
        </form>
      )}
      {crop && (
        <canvas
          ref={canvasRef}
          style={{
            objectFit: "cover",
            maxHeight: "290px",
            maxWidth: "340px",
            width: "100%",
            height: "100%",
            display: "none",
          }}
        />
      )}
    </div>
  );
};

export default ImgUploader;
