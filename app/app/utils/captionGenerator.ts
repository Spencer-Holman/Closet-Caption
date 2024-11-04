// captionGenerator.ts
export async function generateCaption(imageUri: string, apiKey: string): Promise<string> {
  const modelUrl = 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base';

  try {
    // Fetch the image as a Blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Prepare the API request with the image Blob
    const formData = new FormData();
    formData.append('file', blob, 'image.jpg'); // Third parameter sets the filename

    const apiResponse = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!apiResponse.ok) {
      throw new Error(`Failed to generate caption. Status: ${apiResponse.status}`);
    }

    const result = await apiResponse.json();

    // Extract and return the generated caption
    return result[0]?.generated_text || 'No caption generated';
  } catch (error) {
    console.error('Error generating caption:', error);
    return 'Error generating caption';
  }
}
