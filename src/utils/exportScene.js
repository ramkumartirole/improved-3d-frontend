import AWS from "aws-sdk";
import { Buffer } from "buffer";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import Swal from "sweetalert2";

const exportScene = (
  sceneRef,
  user,
  setUploadProgress,
  setUploadSuccess,
  setModelUrl
) => {
  return new Promise((resolve, reject) => {
    const scene = sceneRef.current?.getScene();
    if (!scene) return reject(new Error("Scene is undefined"));

    const BUCKET = import.meta.env.VITE_REACT_APP_AWS_S3_BUCKET_NAME;
    const ACCESS_KEY = import.meta.env.VITE_REACT_APP_AWS_ACCESS_KEY_ID;
    const SECRET_KEY = import.meta.env.VITE_REACT_APP_AWS_SECRET_ACCESS_KEY;
    const REGION = import.meta.env.VITE_REACT_APP_AWS_REGION;

    if (!BUCKET || !ACCESS_KEY || !SECRET_KEY || !REGION) {
      Swal.fire({
        icon: "error",
        title: "AWS Configuration Error",
        text: "Missing AWS credentials or bucket name in .env",
      });
      return reject(new Error("Missing AWS credentials"));
    }

    AWS.config.update({
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
      region: REGION,
    });

    const s3 = new AWS.S3({ apiVersion: "2012-10-17" });
    const username = user?.name
      ? user.name.replace(/\s+/g, "-").toLowerCase()
      : "guest";
    const exportKey = `${username}-${Date.now()}-campervan-sp-144.glb`;

    const exporter = new GLTFExporter();

    Swal.fire({
      title: "Please Wait...",
      html: "Exporting your van configuration...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    exporter.parse(
      scene,
      (gltf) => {
        const params = {
          Bucket: BUCKET,
          Key: exportKey,
          Body: Buffer.from(gltf),
          ContentType: "application/octet-stream",
        };

        const upload = s3.upload(params);

        upload.on("httpUploadProgress", (progress) => {
          const percent = Math.round((progress.loaded * 100) / progress.total);
          setUploadProgress(percent);
          Swal.update({ html: `Uploading... <strong>${percent}%</strong>` });
        });

        upload.send((err, data) => {
          if (err) return reject(err);

          const getSignedUrlParams = {
            Bucket: BUCKET,
            Key: exportKey,
            Expires: 60 * 60 * 24 * 7,
          };

          s3.getSignedUrl("getObject", getSignedUrlParams, (err, url) => {
            if (err) return reject(err);

            setUploadProgress(0);
            setUploadSuccess(true);
            setModelUrl(url);
            resolve(url);
          });
        });
      },
      (error) => reject(error),
      { binary: true }
    );
  });
};

export default exportScene;
