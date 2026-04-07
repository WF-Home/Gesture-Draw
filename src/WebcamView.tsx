import {useEffect, useRef} from 'react';
import { GestureRecognizer, FilesetResolver, GestureRecognizerResult } from '@mediapipe/tasks-vision';
import './WebcamView.css';
import { GestureType } from './GestureType';
import { landmarksCanvas } from './utilities/LandmarksCanvas';
import { draw } from './utilities/Draw';

function WebcamView() {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const artboardRef = useRef<HTMLCanvasElement>(null);
  const gestureRecognizerRef = useRef<GestureRecognizer | null>(null);
  const prevPointRef = useRef<{ x: number; y: number } | null>(null);
  const isDrawingRef = useRef(false);
  let lineWidth = 4;


  const onResults = (results: GestureRecognizerResult) => {

    if (!webcamRef.current || !canvasRef.current || !artboardRef.current) return
    const videoWidth = webcamRef.current.videoWidth;
    const videoHeight = webcamRef.current.videoHeight;

    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    if (artboardRef.current.width === null) {
      artboardRef.current.width = videoWidth;
      artboardRef.current.height = videoHeight;
    }

    const gesture = results.gestures[0][0];

    const artElement = artboardRef.current;
    const artCtx = artElement.getContext("2d");
    if (artCtx == null) throw new Error('Could not get context');
    artCtx.save();

    if (gesture.categoryName === GestureType.thumbsUp) {
        if (lineWidth < 15) {
          lineWidth++;
        }
    } else if (gesture.categoryName === GestureType.thumbsDown) {
        if (lineWidth > 1) {
          lineWidth--;
        }
    } else if (gesture.categoryName === GestureType.up) {
        const tip = results.landmarks[0][8]
        const x = (1 - tip.x) * artElement.width;
        const y = (tip.y * artElement.height) + 30;

        if (isDrawingRef.current && prevPointRef.current) {
          draw(
            artCtx,
            prevPointRef.current.x,
            prevPointRef.current.y,
            x,
            y,
            lineWidth
          );
        }
        prevPointRef.current = { x, y };
        isDrawingRef.current = true;
      } else if (gesture.categoryName === GestureType.ily) {
        artCtx.clearRect(0, 0, artElement.width, artElement.height);
      } else {
        prevPointRef.current = null;
        isDrawingRef.current = false;
      }


    landmarksCanvas(canvasRef.current, results);

  }

  useEffect(() => {
    let running = true;

  async function init() {
      // Load WASM files
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      // Create recognizer
      gestureRecognizerRef.current = await GestureRecognizer.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
          },
          runningMode: "VIDEO",
          numHands: 2,
        }
      );


      const stream = await navigator.mediaDevices.getUserMedia({video: { width: 640, height: 480 }});

      if (!webcamRef.current) return;

      webcamRef.current.srcObject = stream;

      // wait until browser finishes attaching stream
      await new Promise<void>((resolve) => {
        webcamRef.current!.onloadedmetadata = () => resolve();
      });

      await webcamRef.current.play();

      requestAnimationFrame(detect);
    }

    const detect = async () => {
      if (!running || !webcamRef.current || !gestureRecognizerRef.current) {
        return;
      }

      const now = performance.now();

      const result: GestureRecognizerResult =
        gestureRecognizerRef.current.recognizeForVideo(
          webcamRef.current!,
          now
        );

      // Results
      if (result.gestures.length > 0) { 
        onResults(result)
      }

      requestAnimationFrame(detect);
    };

    init();

  }, [])
  return (
    <section id="webcam-container">
        <video ref={webcamRef} id="webcam" />
        <canvas ref={canvasRef} id="canvas" />
        <canvas ref={artboardRef} id="artboard" />
    </section>
  );
}

export default WebcamView;