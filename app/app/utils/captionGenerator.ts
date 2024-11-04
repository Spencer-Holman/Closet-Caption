// captionGenerator.ts
export async function generateCaption(imageUri: string, apiKey: string): Promise<string> {
  const modelUrl = 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base';

  try {
    // Fetch the image as binary data
    const response = await fetch(imageUri);
    const imageBlob = await response.blob();
    
    // Convert the Blob to an ArrayBuffer
    const arrayBuffer = await imageBlob.arrayBuffer();
    const imageData = new Uint8Array(arrayBuffer);

    const apiResponse = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/octet-stream'  // Specify binary content type
      },
      body: imageData  // Send the binary image data directly
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('API response error:', errorText);
      throw new Error(`API Error: ${apiResponse.status} - ${apiResponse.statusText}. ${errorText}`);
    }

    const result = await apiResponse.json();
    return result[0]?.generated_text || 'No caption generated';
  } catch (error) {
    console.error('Error generating caption:', error);
    return 'Error generating caption';
  }
}
