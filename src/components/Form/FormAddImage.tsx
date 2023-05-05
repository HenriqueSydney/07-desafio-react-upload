import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

type ImageRequestData = {
  url: string;
  title: string;
  description: string;
};

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const acceptedFormatImageRegex =
    /(?:([^:/?#]+):)?(?:([^/?#]*))?([^?#](?:jpeg|gif|png))(?:\?([^#]*))?(?:#(.*))?/g;

  const formValidations = {
    image: {
      required: {
        value: true,
        message: 'Arquivo obrigatório',
      },
      validate: {
        lessThan10mb: value =>
          value[0].size <= 10 * 1024 * 1000 ||
          'O arquivo deve ser menor que 10MB',
        acceptedFormats: value =>
          acceptedFormatImageRegex.test(value[0].type) ||
          'Somente são aceitos arquivos PNG, JPEG e GIF',
      },
    },
    title: {
      required: {
        value: true,
        message: 'Título obrigatório',
      },
      minLength: {
        value: 2,
        message: 'Mínimo de 2 caracteres',
      },
      maxLength: {
        value: 20,
        message: 'Máximo de 20 caracteres',
      },
    },
    description: {
      required: {
        value: true,
        message: 'Título obrigatório',
      },
      maxLength: {
        value: 65,
        message: 'Máximo de 65 caracteres',
      },
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (image: ImageRequestData) => {
      api.post('/api/images', {
        ...image,
        url: imageUrl,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['images'] });
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm();

  const { errors } = formState;

  const onSubmit = async (formImageData: ImageRequestData): Promise<void> => {
    try {
      if (!imageUrl) {
        toast({
          title: 'Imagem não adicionada',
          description:
            'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }

      await mutation.mutateAsync(formImageData);

      toast({
        title: 'Imagem cadastrada',
        description: 'Sua imagem foi cadastrada com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch {
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setImageUrl('');
      setLocalImageUrl('');
      reset();
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          error={errors.image}
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          error={errors.title}
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          error={errors.description}
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
