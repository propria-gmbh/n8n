# Image Rework MVP (n8n Cloud)

## Import
1. In n8n Cloud, go to Workflows.
2. Use "Import from File" and select `n8n/workflows/image-rework-mvp.json`.

## Credentials
- Create an HTTP Header Auth credential named "NanoBanana API" and attach it to:
  - HTTP Request - NanoBanana FRONT
  - HTTP Request - NanoBanana PROFILE
- Create/attach a Google Drive OAuth2 credential to all Google Drive nodes.

## Configure reference_url
- In the "Set Reference" node, update `reference_url` with the input image URL.

## Configure NanoBanana base64 JSON path
- In the "Set Reference" node, update `nanobanana_base64_path` to the JSON path of the base64 image in the NanoBanana response.

## Prompts
- In the "Set Reference" node, update `front_prompt` and `profile_prompt`.

## Google Drive base folder
- Set `GDRIVE_IMAGE_REWORK_FOLDER_ID` to the ID of the "Image Rework" folder, or update the "Parent Folder" field in "Google Drive - Create Folder".

## NanoBanana API URL
- Set `NANOBANANA_API_URL` to the NanoBanana endpoint, or update the URL field in both NanoBanana HTTP Request nodes.
