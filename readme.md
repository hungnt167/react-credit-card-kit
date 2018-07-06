# React Credit Card Kit

[![npm version](https://badge.fury.io/js/react-credit-card-kit.svg)](https://badge.fury.io/js/react-credit-card-kit)
[![Build Status](https://travis-ci.org/hungnt167/react-credit-card-kit.svg?branch=master)](https://travis-ci.org/hungnt167/react-credit-card-kit)


> A credit/debit card kit for React , based on  [react-credit-card-input](https://github.com/medipass/react-credit-card-input)


> Support swipe card

## Example

[Click here for an interactive demo](https://medipass.github.io/react-credit-card-input)

![](https://raw.githubusercontent.com/hungnt167/react-credit-card-kit/master/one-field.gif)


![](https://raw.githubusercontent.com/hungnt167/react-credit-card-kit/master/full-form.gif)

![](https://raw.githubusercontent.com/hungnt167/react-credit-card-kit/master/form-n-pay-via-email.gif)


## Install

```
$ npm install --save react-credit-card-kit
```


## Usage


### One line
```js
import CreditCardInput from 'react-credit-card-kit';

...
<CreditCardInput
  cardNumberInputProps={{ value: cardNumber, onChange: this.handleCardNumberChange }}
  cardExpiryInputProps={{ value: expiry, onChange: this.handleCardExpiryChange }}
  cardCVCInputProps={{ value: cvc, onChange: this.handleCardCVCChange }}
  fieldClassName="input"
/>
```

### Full Form

```js
import CreditCardFullForm from 'react-credit-card-kit';

...
<CreditCardForm
  ...
  afterValidateCard={(formIsValid) => {}}
/>
```

### Form and Pay via Email 

```js
import CreditCardFormNPayViaEmail from 'react-credit-card-kit';
...
<CreditCardFormNPayViaEmail
        containerClassName="paypal-by"
        controlClassName="checkpaypal-by"
        enableZipInput={false}
      />
```

## Available props

<table>
<thead><tr><th>Prop</th><th>Type</th><th>Default value</th><th>Description</th></tr></thead>
<tbody>
  <tr><td>  cardNumberInputProps </td><td>object (optional)</td><td>{}</td> <td>Card number input element props<br/>(e.g. { value: cardNumber, onChange: this.handleCardNumberChange, onBlur: this.handleCardNumberBlur })</td></tr>
  <tr><td>  cardExpiryInputProps </td><td>object (optional)</td><td>{}</td> <td>Card expiry date input element props<br/>(e.g. { value: expiry, onChange: this.handleCardExpiryChange, onBlur: this.handleCardExpiryBlur })</td></tr>
  <tr><td>  cardCVCInputProps </td><td>object (optional)</td><td>{}</td> <td>Card CVC input element props<br/>(e.g. { value: cvc, onChange: this.handleCardCVCChange, onBlur: this.handleCardCVCBlur })</td></tr>
  <tr><td>  cardNumberInputRenderer </td><td>Function (view input renderer props below)</td><td></td> <td>Card number input renderer</td></tr>
  <tr><td>  cardExpiryInputRenderer </td><td>Function (view input renderer props below)</td><td></td> <td>Card expiry date input renderer</td></tr>
  <tr><td>  cardCVCInputRenderer </td><td>Function (view input renderer props below)</td><td></td> <td>Card CVC input renderer</tr>
  <tr><td colspan="4"></tr>
  <tr><td>  cardImageClassName </td><td>string (optional)</td><td>''</td> <td>Class name for the card type image</td></tr>
  <tr><td>  cardImageStyle </td><td>object (optional)</td><td>{}</td> <td>Style for the card type image</td></tr>
  <tr><td>  containerClassName </td><td>string (optional)</td><td>''</td> <td>Class name for the field container</td></tr>
  <tr><td>  containerStyle </td><td>object (optional)</td><td>{}</td> <td>Style for the field container</td></tr>
  <tr><td>  showError </td><td>boolean (optional)</td><td>true</td> <td>Option for show error text</td></tr>
  <tr><td>  showPopoverError </td><td>boolean (optional)</td><td>false</td> <td>Option for show error popover</td></tr>
  <tr><td>  autoFocus </td><td>boolean (optional)</td><td>true</td> <td>Auto focus smart way</td></tr>
  <tr><td>  allowCardTypes </td><td>array (optional)</td><td>[]</td> <td> List allow card types</td></tr>
  <tr><td>  translator </td><td>object (optional)</td><td>{}</td> <td> Custom message to localize </td></tr>
  <tr><td>  dangerTextClassName </td><td>string (optional)</td><td>''</td> <td>Class name for the danger text</td></tr>
  <tr><td>  dangerTextStyle </td><td>object (optional)</td><td>{}</td> <td>Style for the danger text container</td></tr>
  <tr><td>  fieldClassName </td><td>string (optional)</td><td>''</td> <td>Class name for the field</td></tr>
  <tr><td>  fieldStyle </td><td>object (optional)</td><td>{}</td> <td>Style for the field</td></tr>
  <tr><td>  inputClassName </td><td>string (optional)</td><td>''</td> <td>Class name for the inputs</td></tr>
  <tr><td>  inputStyle </td><td>object (optional)</td><td>{}</td> <td>Style for the inputs</td></tr>
  <tr><td>  invalidClassName </td><td>string (optional)</td><td>'is-invalid'</td> <td>Class name for the invalid field</td></tr>
  <tr><td>  invalidStyle </td><td>object (optional)</td><td>{}</td> <td>Style for the invalid field</td></tr>
  <tr><td colspan="4"></tr>
  <tr><td>  inputComponent </td><td>string, function, class (optional)</td><td>'input'</td> <td>Input component for the card number, expiry and CVC input</td></tr>
</tbody>
</table>

### Input renderer props

<table>
<thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead>
<tbody>
  <tr><td>  handleCardNumberChange </td><td>Function</td> <td>Handle card number change.</td></tr>
  <tr><td>  handleCardNumberBlur </td><td>Function</td> <td>Handle card number blur.</td></tr>
  <tr><td>  handleCardExpiryChange </td><td>Function</td> <td>Handle card expiry change.</td></tr>
  <tr><td>  handleCardExpiryBlur </td><td>Function</td> <td>Handle card expiry blur.</td></tr>
  <tr><td>  handleCardCVCChange </td><td>Function</td> <td>Handle card CVC change.</td></tr>
  <tr><td>  handleCardCVCBlur </td><td>Function</td> <td>Handle card CVC blur.</td></tr>
  <tr><td>  afterValidateCard </td><td>Function</td> <td>Handle then form validate.</td></tr>
  <tr><td>  props </td><td>Object</td> <td>Input component props</td></tr>
</tbody>
</table>

#### Custom input renderer usage

Only for type `CreditCardInput`

```
<CreditCardInput
  cardCVCInputRenderer={({ handleCardCVCChange, props }) => (
    <input
      {...props}
      onChange={handleCardCVCChange(e => console.log('cvc change', e))}
    />
  )}
  cardExpiryInputRenderer={({ handleCardExpiryChange, props }) => (
    <input
      {...props}
      onChange={handleCardExpiryChange(e =>
        console.log('expiry change', e)
      )}
    />
  )}
  cardNumberInputRenderer={({ handleCardNumberChange, props }) => (
    <input
      {...props}
      onChange={handleCardNumberChange(e =>
        console.log('number change', e)
      )}
    />
  )}
/>
```

## Cheers :)