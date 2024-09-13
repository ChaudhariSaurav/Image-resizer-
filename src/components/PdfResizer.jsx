import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
  Progress,
  Input,
  Text,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';

const PdfResize = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeProgress, setResizeProgress] = useState(0);
  const [targetSize, setTargetSize] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      setPdfPreview(URL.createObjectURL(file));
      onOpen();
    } else {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PDF file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'application/pdf',
  });

  const handleResize = async () => {
    if (!pdfFile || !targetSize) return;

    setIsResizing(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const pdfDoc = await PDFDocument.load(reader.result);
        const pages = pdfDoc.getPages();
        
        // Implement logic to resize based on targetSize here

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        setPdfPreview(url);
        toast({
          title: 'PDF resized successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      };
      reader.readAsArrayBuffer(pdfFile);

      let progress = 0;
      const interval = setInterval(() => {
        if (progress >= 100) {
          clearInterval(interval);
          setIsResizing(false);
        } else {
          progress += 10;
          setResizeProgress(progress);
        }
      }, 500);
    } catch (error) {
      toast({
        title: 'Error resizing PDF',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsResizing(false);
    }
  };

  return (
    <ChakraProvider>
      <Box p={5} textAlign="center">
        <Heading mb={4}>PDF Resizer</Heading>
        <Box textAlign="center" mb={8}>
        {/* Styled message */}
        <Text
          mb={6}
          bg="#fff2f0"
          border="1px"
          borderColor="#000"
          p={2}
          mt={5}
          borderRadius="md"
          textAlign="left"
          fontSize="sm"
        >
          Welcome Back! Please enter your details to login..
        </Text>
      </Box>
        <Box
          p={5}
          border="2px dashed gray"
          borderRadius="md"
          {...getRootProps()}
          textAlign="center"
          mx="auto"
          maxW="500px"
        >
          <input {...getInputProps()} />
          <Heading size="md">Drag 'n' drop a PDF file here, or click to select one</Heading>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>PDF Preview</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {pdfPreview && (
                <iframe
                  src={pdfPreview}
                  width="100%"
                  height="500px"
                  title="PDF Preview"
                />
              )}
              {isResizing && (
                <Box mt={4}>
                  <Progress value={resizeProgress} size="sm" colorScheme="teal" />
                </Box>
              )}
              {!isResizing && (
                <FormControl mt={4}>
                  <FormLabel htmlFor="target-size">Enter target size (in KB):</FormLabel>
                  <Input
                    id="target-size"
                    type="number"
                    value={targetSize}
                    onChange={(e) => setTargetSize(e.target.value)}
                    placeholder="e.g., 500"
                  />
                </FormControl>
              )}
            </ModalBody>
            <ModalFooter>
              {!isResizing && (
                <>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={handleResize}
                    isDisabled={!targetSize}
                  >
                    Resize
                  </Button>
                  <Button variant="ghost" onClick={onClose}>Close</Button>
                </>
              )}
              {pdfPreview && !isResizing && (
                <Button
                  colorScheme="green"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = pdfPreview;
                    link.download = 'resized.pdf';
                    link.click();
                  }}
                  isDisabled={isResizing}
                >
                  Download Resized PDF
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  );
};

export default PdfResize;
