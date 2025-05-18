import React from 'react';
import './ConfirmationModal.css';
import { Button } from './Button';

interface ConfirmationModalProps {
  service: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ service, onConfirm, onCancel }) => {
  return (
    <div className="modal-backdrop">
      <div className="confirmation-modal">
        <p>Do you really want to disconnect from {service}?</p>
        <p>All your applets related to this service will turn inactive.</p>
        <div className="modal-buttons">
          <Button 
            onClick={onConfirm}
            type='button' 
            buttonStyle='btn--primary-inverted'
            buttonSize='btn--medium'
          >
            Yes
          </Button>
          <Button 
            onClick={onCancel}
            type='button'
            buttonStyle='bordered-button'
            buttonSize='btn--medium'
          >
            No
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
