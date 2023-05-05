import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
};

interface GetImageResponse {
  data: {
    data: Image[];
    after: string;
  };
}

export default function Home(): JSX.Element {
  const fetchImages = async ({ pageParam = null }): Promise<GetImageResponse> =>
    api.get('api/images', { params: { after: pageParam } });

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: lastPage => {
      if (lastPage.data.after) {
        return lastPage.data.after;
      }

      return null;
    },
  });

  const formattedData = useMemo(() => {
    return data?.pages.flatMap(image => {
      return image.data.data.flat();
    });
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <Error />;
  }

  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        {formattedData && <CardList cards={formattedData} />}
        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} mt="10">
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </Button>
        )}
      </Box>
    </>
  );
}
