import React from 'react'
import { TextField } from './TextField'
import { Modal, Button, Form, Schema } from 'rsuite'
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
}) {
  const model = Schema.Model({
    full_name: Schema.Types.StringType().isRequired('This field is required.'),
    email: Schema.Types.StringType()
      .isEmail('Please enter a valid email address.')
      .addRule((value) => {
        if (value) {
          const email = value.toLowerCase()
          const isExist = data.find((item) => item.email.toLowerCase() === email)
          if (isExist) {
            return false
          }
          return true
        }
      }, 'Email already exists'),
    contact_no: Schema.Types.StringType().isRequired('This field is required.'),
    password: Schema.Types.StringType()
      .isRequired('This field is required.')
      .minLength(6)
      .maxLength(100),
  })
  return (
    <Modal open={open} onClose={handleClose} size="xs">
      <Modal.Header>
        <Modal.Title>New User</Modal.Title>
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
  )
}

export default AddForm
