import * as tf from "@tensorflow/tfjs-node"
import * as faceapi from "@vladmandic/face-api"
import fs from "fs"
import path from "path"

// Configs
let optionsSSDMobileNet: any;
const minConfidence = 0.1;
const distanceThreshold = 0.5;
const modelPath = 'models';
let labeledFaceDescriptors: any = [];

const createUrl = (registeredUser: string) => path.join(__dirname, `../users/${registeredUser}`)

// Load all the models.
async function initFaceAPI() {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
    await faceapi.nets.faceExpressionNet.loadFromDisk(modelPath);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({ minConfidence, maxResults: 1 });
}

// Get the Descriptors from thr images.
async function getDescriptors(image: any) {
      let tensor: any;
    if(image.includes(`data:image/`)){
      const imageBuffer = Uint8Array.from(Buffer.from(image.split(',')[1], 'base64'));
      // tensor = tf.tensor3d(imageBuffer, [1, imageBuffer.length, 1]);
      tensor = tf.node.decodeImage(imageBuffer , 3);
    }else{
      const buffer = fs.readFileSync(image);
      tensor = tf.node.decodeImage(buffer, 3);

    }
    try{
      const faces = await faceapi.detectAllFaces(tensor, optionsSSDMobileNet)
        .withFaceLandmarks()
        .withFaceExpressions()
        .withFaceDescriptors();
      tf.dispose(tensor);
      return faces.map((face) => face.descriptor);
    }catch(ee:any){
      console.error({ERR: ee})
      throw new Error('Image is not valid');

    }
}

// Register the image of the users.
async function registerImage(image: any) {
    const descriptors = await getDescriptors(image);
    for (const descriptor of descriptors) {
      const labeledFaceDescriptor = new faceapi.LabeledFaceDescriptors(image, [descriptor]);
      labeledFaceDescriptors.push(labeledFaceDescriptor);
    }
}

// Find the best match from the registered images.
async function findBestMatch(image: Uint8Array) {
    const matcher = new faceapi.FaceMatcher(labeledFaceDescriptors, distanceThreshold);
    const descriptors = await getDescriptors(image);
    const matches = [];
    for (const descriptor of descriptors) {
      const match = await matcher.findBestMatch(descriptor);
      matches.push(match);
    }
    return matches;
}


export async function faceRecognition(image: any, username: string) {
    if(labeledFaceDescriptors.length !== 0) labeledFaceDescriptors = []
    await initFaceAPI()
    const imgFolderUrl = createUrl(username)
    const dir = fs.readdirSync(imgFolderUrl)
    for (const f of dir) {
      if(
        f.split('.')[1] === 'png' ||
        f.split('.')[1] === 'jpeg' ||
        f.split('.')[1] === 'jpg'
      ){
        await registerImage(path.join(imgFolderUrl, f));
      }
    };
    let bestMatch = null
    try{
      bestMatch = await findBestMatch(image);
    }catch(error: any){
      console.error({error: error.message})
    }
    return bestMatch;
}