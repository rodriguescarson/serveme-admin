import React from 'react'
import { Form } from 'rsuite'
export const TextField = ({ cid, name, label, accepter, ...rest }) => (
  <Form.Group controlId={cid}>
    <Form.ControlLabel>{label}</Form.ControlLabel>
    <Form.Control name={name} accepter={accepter} {...rest} />
  </Form.Group>
)
