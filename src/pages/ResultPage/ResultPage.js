import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useSelector } from 'react-redux'
import "./ResultPage.css";
import result_icon from "../../images/result_icon.svg";
import ResultSlider from "./ResultSlider";
import DocumentCard from "./DocumentCard";
import { selectData } from '../../features/histogramsSlice'

function ResultPage() {
  const resultData = useSelector(selectData);
  const initialCardsCount = 4;

  const [cardsData, setCardsData] = useState([]);
  const [next, setNext] = useState(initialCardsCount);

  const handleMoreImage = () => {
    setNext(next + initialCardsCount);
  };

  const getCardsData = (ids) => {
    const token = JSON.parse(localStorage.getItem("authToken"));
    const url = "https://gateway.scan-interfax.ru/api/v1/documents";
    const payload = {
      ids,
    };

    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    };

    return fetch(url, options)
      .then((response) => {
        return response.json();
      })
      .catch(function (error) {
        throw new Error(error);
      });
  }

  useEffect(() => {
    const ids = resultData.items.map(item => item.encodedId)
    getCardsData(ids).then(data => {
      setCardsData(data)
    })
  }, [resultData])

  return (
    <div className="result-page">
      <div className="result-page__container">
        <div className="result-page__top-container">
          <div className="result-page__title-box">
            <h2 className="result-page__title">
              ИЩЕМ.СКОРО <br /> БУДУТ РЕЗУЛЬТАТЫ
            </h2>
            <p className="result-page__subtitle">
              Поиск может занять некоторое время, просим сохранять терпение.
            </p>
          </div>
          <div className="result-page__icon">
            <img className="result-page__icon" src={result_icon}></img>
          </div>
        </div>
        <div className="result-page__mid-container">
          <div className="result-page__title-box">
            <h3 className="result-page__mid-title pb-2">ОБЩАЯ СВОДКА</h3>
            <p className="result-page__result-subtitle">
              Найдено NUM вариантов
            </p>
          </div>
          <ResultSlider />
        </div>
        <h3 className="result-page__mid-title mb-5">СПИСОК ДОКУМЕНТОВ</h3>
        <div className="result-page__cards-container mb-5">


        {cardsData?.slice(0, next)?.map((card, index) => {
            return (
              <div
                key={index}
              >
                <DocumentCard />
              </div>
            );
          })}
        </div>
        <div className="result-page__button-box">


          {next < cardsData?.length && (
            <Button
              className="mt-4"
              onClick={handleMoreImage}
            >
              Load more
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultPage; 