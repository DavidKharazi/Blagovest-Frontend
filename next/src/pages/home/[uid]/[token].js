
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { styled } from '@mui/system';
import Typography from '@mui/material/Typography';

const AnimatedDataGrid = animated(DataGrid);

const AnimatedCell = styled('div')(({ style }) => ({
  opacity: style.opacity,
  transform: `translate(${style.transform[0]}px, ${style.transform[1]}px)`,
  transition: 'opacity 500ms, transform 500ms',
}));

const CustomPagination = () => null;
const CustomFooter = () => null;

export default function AutoHeightOverlayNoSnap() {
  const [cellColors, setCellColors] = useState({});
  const [data, setData] = useState([]);
  const [uniqueMonths, setUniqueMonths] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [colorData, setColorData] = useState({});
  const [instrumentData, setInstrumentData] = useState({});
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    const savedSelectedTable = localStorage.getItem('selectedTable');
    if (savedSelectedTable) {
      setSelectedTable(parseInt(savedSelectedTable));
    }

    fetchData();
    fetchColorData();
    fetchInstrumentData();

    const tokenFromStorage = localStorage.getItem('token');
    if (!tokenFromStorage) {
      localStorage.removeItem('user_id');
      localStorage.removeItem('name');
    }

    const handleStorageChange = (event) => {
      if (event.key === 'token' && !event.newValue) {
        localStorage.removeItem('user_id');
        localStorage.removeItem('name');
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const savedColors = {};
    data.forEach((row) => {
      const savedColorsFromStorage = localStorage.getItem(`savedColors_${row.id}`);
      if (savedColorsFromStorage) {
        try {
          savedColors[row.id] = JSON.parse(savedColorsFromStorage);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    });
    setCellColors(savedColors);
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/wbdjango/');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchColorData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/color_users/');
      setColorData(response.data);

      const months = response.data.map((color) => color.date.substring(0, 7));
      const dates = response.data.map((color) => color.date);
      setUniqueMonths([...new Set(months)]);
      setUniqueDates([...new Set(dates)]);
    } catch (error) {
      console.error('Error fetching color data:', error);
    }
  };

  const fetchInstrumentData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/instrument_users/');
      setInstrumentData(response.data);
    } catch (error) {
      console.error('Error fetching instrument data:', error);
    }
  };

  const handleCellClick = (params) => {
    const { id, field } = params;

    const userIdFromStorage = localStorage.getItem('user_id');
    if (userIdFromStorage && parseInt(userIdFromStorage) === id) {
      setCellColors((prevColors) => ({
        ...prevColors,
        [id]: {
          ...prevColors[id],
          [field]: prevColors[id]?.[field] === 'green' ? 'red' : 'green',
        },
      }));
      setSelectedTable(id); // Добавить эту строку
    } else {
      console.log('Нет доступа к изменению цвета для данного пользователя.');
    }
  };

  const handleInstrumentChange = (params, selectedInstrument) => {
    const { id } = params;

    const userIdFromStorage = localStorage.getItem('user_id');
    if (userIdFromStorage && parseInt(userIdFromStorage) === id) {
      setCellColors((prevColors) => ({
        ...prevColors,
        [id]: {
          ...prevColors[id],
          instrument: selectedInstrument,
        },
      }));
      setSelectedTable(id); // Добавить эту строку
    } else {
      console.log('Нет доступа к изменению инструмента для данного пользователя.');
    }
  };

  const handleSaveClick = async (id, month) => {
    const rowColors = cellColors[id] || {};
    localStorage.setItem(`savedColors_${id}`, JSON.stringify(rowColors));

    try {
      const colorRequests = [];
      uniqueDates.forEach((date) => {
        if (date.startsWith(month)) {
          const colorValue = rowColors[date] === 'green';
          colorRequests.push(axios.post('http://127.0.0.1:8000/api/color_users/', {
            user: id,
            color: colorValue,
            date,
          }));
        }
      });

      if (rowColors.instrument) {
        const instrumentValue = rowColors.instrument;
        colorRequests.push(axios.post('http://127.0.0.1:8000/api/instrument_users/', {
          user: id,
          instrument: instrumentValue,
        }));
      }

      await Promise.all(colorRequests);
    } catch (error) {
      console.error('Error saving colors and instrument:', error);
    }
  };

  const dynamicBackground = 'linear-gradient(to right, #B0E0E6, #FFFFE0)';

  return (
    <div
      style={{
        background: dynamicBackground,
        overflow: 'auto',
        minHeight: '100vh',
      }}
    >
      {uniqueMonths.slice(0).reverse().map((month, index) => {
        const isTopTable = index === 0;
        const isDisabledTable = selectedTable !== null && !isTopTable;

        return (
          <Box
            key={month}
            sx={{
              margin: '50px auto',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 8px rgba(56, 0, 0, 1.9)',
              padding: '30px',
              marginLeft: '350px',
              borderRadius: '10px',
              backgroundColor: isTopTable ? '#f0f0f0' : 'rgba(240, 240, 240, 0.7)',
              pointerEvents: isDisabledTable ? 'none' : 'auto',
              opacity: isDisabledTable ? 0.5 : 1,
            }}
          >
            <Typography
              variant="h4"
              color="#6d76f7"
              fontSize="3rem"
              fontWeight="bold"
              gutterBottom
            >
              Расписание репетиций - {new Date(month).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
            </Typography>
            <div style={{ overflowX: 'hidden' }}>
              <AnimatedDataGrid
                autoHeight
                pagination={false}
                rowsPerPageOptions={[]}
                components={{
                  Pagination: CustomPagination,
                  Footer: CustomFooter,
                }}
                columns={[
                  {
                    field: 'Имя',
                    valueGetter: (params) => data.find((item) => item.id === params.id)?.name || '',
                  },
                  {
                    field: 'Инструменты',
                    renderCell: (params) => (
                      <AnimatedCell style={useSpring({
                        opacity: 1,
                        transform: 'translate(0px, 0px)',
                        from: { opacity: 0, transform: 'translate(20px, 20px)' },
                        config: { duration: 500 },
                      })}>
                        <select
                          value={cellColors[params.id]?.instrument || ''}
                          onChange={(e) => {
                            const selectedInstrument = e.target.value;
                            handleInstrumentChange(params, selectedInstrument);
                          }}
                          style={{
                            borderRadius: '5px',
                            padding: '5px',
                            border: '1px solid #ccc',
                            cursor: 'pointer',
                          }}
                          disabled={isDisabledTable}
                        >
                          <option value="гитара">Гитара</option>
                          <option value="бас">Бас</option>
                          <option value="кахон">Кахон</option>
                          <option value="клавиши">Клавиши</option>
                          <option value="скрипка">Скрипка</option>
                          <option value="вокал">Вокал</option>
                        </select>
                      </AnimatedCell>
                    ),
                  },
                  ...uniqueDates
                    .filter((date) => date.startsWith(month))
                    .map((date) => ({
                      field: date,
                      renderCell: (params) => (
                        <AnimatedCell style={useSpring({
                          opacity: 1,
                          transform: 'translate(0px, 0px)',
                          from: { opacity: 0, transform: 'translate(20px, 20px)' },
                          config: { duration: 500 },
                        })}>
                          <div
                            style={{
                              background: cellColors[params.id]?.[date] === 'green' ? '#4CAF50' : cellColors[params.id]?.[date] === 'red' ? '#FF5252' : 'white',
                              padding: '45px',
                              borderRadius: '20px',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleCellClick(params)}
                          >
                            {params.value}
                          </div>
                        </AnimatedCell>
                      ),
                    })),
                  {
                    field: 'Сохранить',
                    renderCell: (params) => (
                      <AnimatedCell style={useSpring({
                        opacity: 1,
                        transform: 'translate(0px, 0px)',
                        from: { opacity: 0, transform: 'translate(20px, 20px)' },
                        config: { duration: 500 },
                      })}>
                        <button
                          style={{
                            background: '#6d76f7',
                            color: 'white',
                            padding: '8px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            border: 'none',
                            outline: 'none',
                          }}
                          onClick={() => {
                            handleCellClick(params);
                            handleSaveClick(params.id, month);
                          }}
                          disabled={isDisabledTable}
                        >
                          Сохранить
                        </button>
                      </AnimatedCell>
                    ),
                  },
                ]}
                rows={data}
                onCellClick={(params) => {
                  setSelectedTable(params.id); // Заменить эту строку
                  localStorage.setItem('selectedTable', params.id);
                }}
              />
            </div>
          </Box>
        );
      })}
    </div>
  );
}




