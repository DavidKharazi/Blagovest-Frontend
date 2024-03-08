import * as React from 'react';
import { Button, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import axios from 'axios';

export default function AlphabetMenu() {
  const alphabet = [
    'А', 'Б', 'В', 'Г', 'Д',
    'Е', 'Ж', 'З', 'И', 'К',
    'Л', 'М', 'Н', 'О', 'П',
    'Р', 'С', 'Т', 'У', 'Х',
    'Ц', 'Ш', 'Э', 'Я'
  ];

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [name, setName] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [songs, setSongs] = React.useState([]);
  const [selectedLetter, setSelectedLetter] = React.useState('');
  const [selectedSong, setSelectedSong] = React.useState(null);

  const handleButtonClick = (event, letter) => {
    setAnchorEl(event.currentTarget);
    handleMenuItemClick(letter);
  };

  const handleMenuItemClick = async (letter) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/songs/', {
        params: { letter: letter },
      });
      setSongs(response.data);
      setSelectedLetter(letter);
    } catch (error) {
      console.error('Ошибка при получении списка песен', error);
    }
  };

  const handleSongClick = (song) => {
    setSelectedSong(song);

    const fileExtension = song.file.split('.').pop().toLowerCase();

    if (fileExtension === 'pdf') {
      const link = document.createElement('a');
      link.href = getFullImageUrl(song.file);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.click();
    } else if (['jpg', 'jpeg', 'png'].includes(fileExtension)) {
      const imgWindow = window.open(getFullImageUrl(song.file), '_blank');
      imgWindow.focus();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUploadClick = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSendClick = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('file', selectedFile);

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/file/posts/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Файл успешно загружен', response.data);
      } catch (error) {
        console.error('Ошибка при загрузке файла', error);
      } finally {
        setOpenDialog(false);
      }
    }
  };

  const getFullImageUrl = (relativePath) => {
    const baseUrl = 'http://127.0.0.1:8000';
    return `${baseUrl}${relativePath}`;
  };

  const dynamicBackground = 'linear-gradient(to right, #FFFFE0, #B0E0E6)';

  return (
    <div style={{ display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh',
                  background: dynamicBackground,
                  overflow: 'auto',
                  minHeight: '100vh',
               }}>

      <div style={{ maxWidth: '900px', backgroundColor: '#FFDEAD', padding: '36px', borderRadius: '8px', margin: '20px auto' }}>
        <p style={{ color: '#333', fontSize: '22px' }}>
          Дорогие друзья, здесь вы можете загрузить новую песню. А также найти необходимую песню по алфавитному указанию.
          Просто кликните на букву, с которой начинается песня, и вам выпадет список всех песен, начинающихся на эту букву.
        </p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxWidth: '50%', margin: 'auto' }}>
        {alphabet.map((letter, index) => (
          <div key={index} style={{ flexBasis: '16.666%', width: '40px', textAlign: 'center' }}>
            <Button
              onClick={(event) => handleButtonClick(event, letter)}
              sx={{
                width: '80%',
                top: '-30px',
                height: '40px',
                fontSize: '16px',
                margin: '2px',
                borderRadius: '10px',
                border: '1px solid #000',
                backgroundColor: '#fff',
                marginLeft: '70px',
                boxShadow: '0 4px 8px rgba(56, 0, 0, 1.9)',
                 transition: 'background-color 0.3s ease',
                ':hover': {
                  backgroundColor: '#ccc',
                },
              }}
            >
              {letter}
            </Button>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', margin: '20px auto' }}>
        <Button
          onClick={handleUploadClick}
          variant="contained"
          color="primary"
          style={{ height: '40px', top: '-50px' }}
        >
          Загрузить новую песню
        </Button>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        {songs
          .filter((song) => song.name.startsWith(selectedLetter))
          .map((song, index) => (
            <MenuItem key={index} onClick={() => handleSongClick(song)}>
              {song.name}
            </MenuItem>
          ))}
        {songs.length === 0 && <MenuItem>Нет песен для буквы {selectedLetter}</MenuItem>}
      </Menu>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Введите имя файла и выберите файл</DialogTitle>
        <DialogContent>
          <TextField
            label="Имя файла"
            variant="outlined"
            margin="normal"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input type="file" accept="image/*" onChange={handleFileInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleSendClick} color="primary">
            Отправить
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ marginTop: 'auto', textAlign: 'center', marginBottom: '20px' }}>
        {selectedSong && (
          <div>
            {selectedSong.file.toLowerCase().endsWith('.pdf') ? (
              <p>Откройте PDF в новой вкладке: <a href={getFullImageUrl(selectedSong.file)} target="_blank" rel="noopener noreferrer">{selectedSong.name}</a></p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}






