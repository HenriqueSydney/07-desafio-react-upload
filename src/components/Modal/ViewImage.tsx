import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="pGray.800" maxH="600px" maxW="900px">
        <ModalBody p={0}>
          <Image
            src={imgUrl}
            alt="Imagem selecionada"
            objectFit="cover"
            w="100%"
          />
        </ModalBody>

        <ModalFooter justifyContent="flex-start" h="8">
          <Link href={imgUrl} color="pGray.50" fontSize="md" isExternal>
            Abrir original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
