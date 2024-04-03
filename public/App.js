import React, { useEffect, useState } from 'react';
import './App.css'
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

function App() {
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [imageURL, setImageURL] = useState('');

// Загрузка модели при монтировании компонента
useEffect(() => {
  let isMounted = true;

  const loadModel = async () => {
    const loadedModel = await mobilenet.load();
    if (isMounted) {
      setModel(loadedModel);
    }
  };

  if (!model) {
    loadModel();
  }

  // Очистка ресурсов при размонтировании компонента
  return () => {
    isMounted = false;
    // Освобождение ресурсов, если это необходимо
    // Например, model.dispose(), если такой метод доступен для вашей модели
  };
}, [model]);
// Добавляем 'model' в массив зависимостей

  // Функция для классификации изображения
  const classifyImage = async () => {
    if (imageURL && model) {
      const imageElement = document.createElement('img');
      imageElement.src = imageURL;
      const imgTensor = tf.browser.fromPixels(imageElement);
      const predictions = await model.classify(imgTensor);
      setPredictions(predictions);
    }
  };


  // Обработчик изменения ввода изображения
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setImageURL(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="App">
      <div class="inputs">
        <input class="file" type="file" accept="image/*" onChange={handleImageChange}></input>
        <button class="button" onClick={classifyImage}>Классифицировать</button>
      </div>
      <div>
        {imageURL && <img src={imageURL} alt="Uploaded" style={{ maxWidth: '400px' }} />}
      </div>
      {predictions.length !== 0 && <div>{predictions[0].className} : {Math.round(prediction.probability * 100)}%</div>}
    </div>
  );
}

export default App;