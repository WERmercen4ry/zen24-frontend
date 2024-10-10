import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const ConfirmPopup = ({ 
  isOpen, 
  toggle, 
  onConfirm, 
  isConfirm, // Trạng thái xác định là "Confirm" hay "Thông báo"
  title, // Tiêu đề popup
  message // Nội dung thông báo
}) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="confirm-popup modal-confirm">
      <ModalHeader toggle={toggle} className="confirm-popup-header">
        {title}
      </ModalHeader>
      <ModalBody className="confirm-popup-body">
        {message}
      </ModalBody>
      <ModalFooter className="confirm-popup-footer px-4">
        {isConfirm ? (
          <>
            <Button color="secondary" onClick={toggle} className="cancel-button">
              Huỷ
            </Button>
            <Button color="primary" onClick={onConfirm} className="confirm-button">
              OK
            </Button>
          </>
        ) : (
          <Button color="primary" onClick={toggle} className="close-button">
            Đóng
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmPopup;
