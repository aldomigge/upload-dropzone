import { forwardRef, Fragment } from 'react';

import { Controller } from 'react-hook-form';
import DropZone from 'react-dropzone';
import { List, ListItem, ListItemIcon, ListItemText, Paper, styled } from '@mui/material';
import { CloudUpload, InsertDriveFile } from '@mui/icons-material';

export const FileInput = forwardRef((props, _) => {
  const { name, control, ...rest } = props;

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <Fragment>
          <DropZone {...rest} onDrop={(file) => onChange(file)} ref={ref}>
            {({ getRootProps, getInputProps }) => (
              <PaperStyled variant="outlined" {...getRootProps()}>
                <CloudUpload
                  sx={{ marginTop: '16px', color: '#888', fontSize: '42px' }}
                />
                <input {...getInputProps()} name={name} onBlur={onBlur} />
                <p>Arraste e solte o arquivo aqui ou clique para selecionar o arquivo</p>
              </PaperStyled>
            )}
          </DropZone>
          <List>
            {value.map((file, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <InsertDriveFile />
                </ListItemIcon>
                <ListItemText primary={file.name} secondary={formatBytes(file.size)} />
              </ListItem>
            ))}
          </List>
        </Fragment>
      )}
    />
  );
});

const PaperStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,

  cursor: 'pointer',
}));
