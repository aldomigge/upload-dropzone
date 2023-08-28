import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  TextField,
} from '@mui/material';
import { api } from './axios/api';
import { FileUploadOutlined, Login } from '@mui/icons-material';

import { useForm } from 'react-hook-form';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileInput } from './components/FileInput';
import { FormProvider } from 'react-hook-form';
import { Form } from './components/Form';

import { useNotificationContext } from './contexts/notificationContext';

import logoDefault from './assets/logo_default.png';

export default function MyApp() {
  const queryClient = useQueryClient();

  const notification = useNotificationContext();

  const [newLogo, setNewLogo] = useState(null);
  const fileRef = useRef(null);

  const { control, handleSubmit, watch, register, reset } = useForm({
    defaultValues: {
      files: [],
    },
  });

  // console.log({ newLogo });

  const files = watch('files');

  console.log({ files });

  const [logo, setLogo] = useState(null);
  const fetchLogo = async () => {
    try {
      const { data: logoData } = await api.get('/logo');

      // console.log({ logoData });

      setNewLogo(logoData ? logoData.image.data : logoDefault);

      if (logoData) return logoData;
    } catch (error) {
      const message = error;

      console.log({ message });
    }
  };

  const onSubmitData = async () => {
    try {
      if (!fileRef.current.files.length) return;

      console.log(fileRef.current.files);

      const formData = new FormData();

      for (let i = 0; i < fileRef.current.files.length; i++) {
        formData.append('logo', fileRef.current.files[i]);
      }

      const { data: response } = await api.post('/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response) return;

      reset({ files: [] });

      notification.show('success', 'Foto salva com sucesso', 6000);

      return response;
    } catch (error) {
      const message = error.message;

      notification.show('error', message, 6000);

      console.log({ message });
    }
  };

  const saveLogo = async (data) => {
    try {
      const formData = new FormData();

      if (data.files) {
        data.files.forEach((file) => {
          formData.append('documents', file, file.name);
        });
      }

      console.log({ formData });

      const { data: response } = await api.post('/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response) {
        return;
      }

      // reset();

      notification.show('success', 'Foto salva com sucesso', 6000);

      console.log({ response });

      return response;
    } catch (error) {
      const message = error.message;
      console.log({ error });

      notification.show('error', message, 6000);
    }
  };

  const getLogo = useQuery(['getLogo'], fetchLogo, {
    retryOnMount: true,
  });

  const { mutate: uploadLogo } = useMutation(saveLogo, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'getLogo' });
    },
    onError: (error) => {
      // console.log({ error });
    },
  });

  // console.log({ logoShow });

  return (
    <Box>
      <img src={newLogo} alt="Logo" width="240px" />
      {/* <Box
        onSubmit={handleSubmit(uploadLogo)}
        component="form"
        encType={'multipart/form-data'}
      >
        <input accept="image/*" type="file" ref={fileRef} />
        <Button type="submit">
          <FileUploadOutlined />
        </Button>
      </Box> */}
      <Form onSubmit={handleSubmit(uploadLogo)}>
        <FileInput control={control} {...register('files')} />
        <Button variant="contained" color="primary" type="submit" startIcon={<Login />}>
          Enviar
        </Button>
      </Form>
    </Box>
  );
}
