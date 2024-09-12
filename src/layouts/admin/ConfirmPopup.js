import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const ConfirmPopup = ({ isOpen, toggle, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} toggle={toggle} className="confirm-popup">
      <ModalHeader toggle={toggle} className="confirm-popup-header">
        Are you sure?
      </ModalHeader>
      <ModalBody className="confirm-popup-body">
        Are you sure you want to delete this item? This action cannot be undone.
      </ModalBody>
      <ModalFooter className="confirm-popup-footer">
        <Button color="secondary" onClick={toggle} className="cancel-button">
          Huỷ
        </Button>
        <Button color="danger" onClick={onConfirm} className="delete-button">
          Xoá
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmPopup;
