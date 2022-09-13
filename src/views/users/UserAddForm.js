import React from 'react'
import ImageUploader from '../../utils/formComponents/ImageUploader'
import { TextField } from '../../utils/formComponents/TextField'
import { Modal, Button, Form, Schema } from 'rsuite'
// change according to your needs
const selectDataState = ['Goa', 'Karnataka', 'Maharshtra'].map((item) => ({
  label: item,
  value: item,
}))

const selectDataDistrict = ['South-Goa', 'North-Goa'].map((item) => ({
  label: item,
  value: item,
}))

const selectDataCity = ['Panjim', 'Margao'].map((item) => ({
  label: item,
  value: item,
}))

const selectDataCountry = ['India', 'USA'].map((item) => ({
  label: item,
  value: item,
}))

function UserAddForm({
  open,
  handleClose,
  formRef,
  setFormValue,
  formValue,
  SelectPicker,
  addDataToFirebase,
  data,
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
          <TextField
            cid="avatar"
            name="avatar"
            label="Profile Picture"
            accepter={ImageUploader}
            action="//jsonplaceholder.typicode.com/posts/"
          />
          <TextField cid="full_name-9" name="full_name" label="Full Name" />
          <TextField cid="email-9" name="email" label="Email" type="email" />
          <TextField cid="password-9" name="password" label="Password" type="password" />
          <TextField cid="contactNumber-9" name="contact_no" label="Contact Number" type="number" />
          {/* <Form.Group controlId="textarea-9">
          <Form.ControlLabel>Textarea</Form.ControlLabel>
          <Form.Control rows={5} name="textarea" accepter={Textarea} />
        </Form.Group> */}
          <TextField cid="add_1-9" name="add_1" label="Address 1" type="text" />
          <TextField cid="add_2-9" name="add_2" label="Address 2" type="text" />
          <TextField cid="pincode-9" name="pincode" label="Pincode" type="number" />
          <TextField
            cid="state-10"
            name="state"
            label="State"
            data={selectDataState}
            accepter={SelectPicker}
          />
          <TextField
            cid="district-10"
            name="district"
            label="District"
            data={selectDataDistrict}
            accepter={SelectPicker}
          />
          <TextField
            cid="city-10"
            name="city"
            label="City"
            data={selectDataCity}
            accepter={SelectPicker}
          />
          <TextField
            cid="country-10"
            name="country"
            label="Country"
            data={selectDataCountry}
            accepter={SelectPicker}
          />
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

export default UserAddForm
