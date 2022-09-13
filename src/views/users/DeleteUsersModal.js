import React from 'react'
import { Modal, Button } from 'rsuite'
function DeleteUsersModal({
  deleteUserModal,
  handleCloseDeleteModal,
  handleDeleteState,
  deleteId,
}) {
  return (
    <Modal open={deleteUserModal} onClose={handleCloseDeleteModal}>
      <Modal.Header>
        <Modal.Title>Delete User</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
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

export default DeleteUsersModal
