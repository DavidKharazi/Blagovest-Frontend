import React, { useEffect, useState } from "react";
import { BarChart, Bar, YAxis, XAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

function Example() {
  const [chartData, setChartData] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [isChartVisible, setIsChartVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/color_users/");
        const data = await response.json();
        // Сортировка данных по убыванию id
        const sortedData = data.sort((a, b) => b.id - a.id);
        setChartData(sortedData);

        // Получение имен пользователей
        const namesResponse = await fetch("http://127.0.0.1:8000/api/wbdjango/");
        const namesData = await namesResponse.json();
        const namesMap = {};
        namesData.forEach(user => {
          namesMap[user.id] = user.name;
        });
        setUserNames(namesMap);

        setIsChartVisible(true); // Устанавливаем флаг видимости графика
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    fetchData();
  }, []);

  const processDataForChart = () => {
    // Создаем объект для хранения уникальных дат для каждого пользователя
    const uniqueDatesMap = {};

    const processedData = chartData.reduce((acc, entry) => {
      const userId = entry.user;
      const colorValue = entry.color;
      const date = entry.date;

      if (!uniqueDatesMap[userId]) {
        uniqueDatesMap[userId] = new Set();
      }

      if (!uniqueDatesMap[userId].has(date)) {
        uniqueDatesMap[userId].add(date);

        const userName = userNames[userId];

        if (!acc[userId]) {
          acc[userId] = { userName, trueCount: 0, falseCount: 0, color: getRandomColor() };
        }

        if (colorValue) {
          acc[userId].trueCount += 1;
        } else {
          acc[userId].falseCount += 1;
        }
      }

      return acc;
    }, {});

    return Object.values(processedData);
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const renderChart = () => {
    if (!isChartVisible) {
      return null; // Если график не видим, возвращаем null
    }

    const data = processDataForChart();

    return (
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data} animation={{ duration: 1000 }}>
          <XAxis dataKey="userName" />
          <YAxis type="number" tickFormatter={(value) => `${value}%`} />
          <Tooltip />
          <Legend />
          <Bar dataKey="trueCount" stackId="a" fill="#4CAF50" name="Присутствовал" />
          <Bar dataKey="falseCount" stackId="a" fill="#FF5252" name="Отсутствовал" />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="text-center mt-[50vh]">
      <h1 className="w-[110px] mx-auto mt-10 text-xl font-semibold capitalize">Custom Chart</h1>
      <div style={{ width: '100%', height: '600px' }} className='border border-gray-400 pt-0 rounded-xl mx-auto shadow-xl'>
        {renderChart()}
      </div>
    </div>
  );
}

export default Example;


