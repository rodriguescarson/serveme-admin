import React from 'react'
import { Modal, Button } from 'rsuite'
function DeleteModal({ modalStatus, handleCloseDeleteModal, handleDeleteState, deleteId }) {
  return (
    <Modal open={modalStatus} onClose={handleCloseDeleteModal}>
      <Modal.Header>
        <Modal.Title>Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            handleDeleteState(deleteId)
            handleCloseDeleteModal()
          }}
          appearance="primary"
        >
          Confirm
        </Button>
        <Button onClick={handleCloseDeleteModal} appearance="subtle">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteModal
