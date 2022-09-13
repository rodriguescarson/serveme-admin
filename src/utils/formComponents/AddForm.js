import React from 'react'
import { TextField } from './TextField'
import { Modal, Button, Form, Schema, IconButton, FlexboxGrid } from 'rsuite'
import PlusIcon from '@rsuite/icons/Plus'
// change according to your needs

function AddForm({
  open,
  handleClose,
  formRef,
  setFormValue,
  formValue,
  SelectPicker,
  addDataToFirebase,
  data,
  formDataParameters,
  handleOpen,
  model,
}) {
  return (
    <>
      <Modal open={open} onClose={handleClose} size="xs">
        <Modal.Header>
          <Modal.Title>New</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid ref={formRef} model={model} onChange={setFormValue} formValue={formValue}>
            {formDataParameters.map((item, i) => {
              return (
                <TextField
                  key={i}
                  cid={item.cid}
                  name={item.name}
                  label={item.label}
                  data={item.data}
                  accepter={item.accepter}
                  type={item.type}
                />
              )
            })}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addDataToFirebase} appearance="primary" type="submit">
            Confirm
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <FlexboxGrid justify="end" style={{ marginBottom: 10 }}>
        <FlexboxGrid.Item colspan={2}>
          <IconButton icon={<PlusIcon />} color="red" appearance="primary" onClick={handleOpen}>
            Add
          </IconButton>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </>
  )
}

export default AddForm
