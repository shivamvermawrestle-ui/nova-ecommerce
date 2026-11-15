import uploadProductPermission from "../helper/permission.js";

const uploadImage = async (req, res) => {
  try {
    const allowed = await uploadProductPermission(req.userId);
    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to upload product images.",
      });
    }

    const image = req.body?.image;
    if (
      typeof image !== "string" ||
      !/^data:image\/(png|jpe?g|webp|gif);base64,/.test(image)
    ) {
      return res.status(400).json({
        success: false,
        message: "Choose a valid image file.",
      });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary cloud name or upload preset is not configured.",
      });
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", uploadPreset);

    const cloudinaryResponse = await fetch(
      "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const result = await cloudinaryResponse.json();

    if (!cloudinaryResponse.ok) {
      return res.status(502).json({
        success: false,
        message: result?.error?.message || "Cloudinary image upload failed.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        secure_url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Cloudinary image upload failed.",
    });
  }
};

export default uploadImage;