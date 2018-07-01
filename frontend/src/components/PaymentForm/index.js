import React, { Component } from 'react'
import Text from '../Text'
import { IconPoweredByStripe } from '../Icons'
import {
  invertedBackground,
  invertedText,
  text,
  background,
  brightRed,
} from '../style/color'
import { fontFamily } from '../style/font'
import {
  StripeProvider,
  Elements,
  injectStripe,
  CardElement,
} from 'react-stripe-elements'
import Button from '../Button'

const ErrorDisplay = ({ error }) => (
  <div
    style={{
      marginTop: '2rem',
    }}
  >
    <Text color={brightRed} size={1.5} weight={400} capitalize>
      {error}
    </Text>
  </div>
)

class StripePaymentForm extends Component {
  constructor() {
    super()
    this.state = {
      error: null,
      submitting: false,
    }
  }
  handleSubmit = e => {
    e.preventDefault()
    this.setState({
      submitting: true,
    })
    this.props.stripe
      .createSource({ type: 'card' })
      .then(result => {
        this.setState({
          submitting: false,
        })
        if (result.error) {
          this.setState({
            error: result.error.message,
          })
        } else {
          this.props.onSubmit(result.source)
        }
      })
      .catch(error => {
        this.setState({
          submitting: false,
        })
        this.setState({
          error: error.message,
        })
      })
  }

  handleChange = e => {
    if (e.error) {
      this.setState({
        error: e.error.message,
      })
    } else if (this.state.error && !e.error) {
      this.setState({
        error: null,
      })
    }
  }

  render() {
    return (
      <form
        style={{
          background: invertedBackground,
          width: '60rem',
          padding: '3rem',
        }}
        onSubmit={this.handleSubmit}
      >
        <div
          style={{
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          <Text color={invertedText} size={3} capitalize>
            {`Set Payment Source For ${this.props.customerName}`}
          </Text>
        </div>
        <div
          style={{
            marginBottom: '3rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div>
            <Text color={invertedText} size={1.5} capitalize>
              {`Credit and debit cards Accepted`}
            </Text>
          </div>
          <div>
            <IconPoweredByStripe color={invertedText} width={15} height={2.5} />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              background: background,
              padding: '1rem',
            }}
          >
            <CardElement
              style={{
                base: {
                  fontSize: '20px',
                  color: text,
                  iconColor: text,
                  fontFamily,
                  '::placeholder': {
                    color: text,
                  },
                },
                invalid: {
                  color: brightRed,
                  iconColor: brightRed,
                  '::placeholder': {
                    color: brightRed,
                  },
                },
              }}
              iconStyle={'solid'}
              onChange={this.handleChange}
            />
          </div>
          {this.state.error ? <ErrorDisplay {...this.state} /> : null}
          <div style={{ display: 'flex', marginTop: '2rem' }}>
            <div style={{ flexGrow: 1 }}>
              <Button
                type={'button'}
                onClick={this.props.onCancelClick}
                disabled={this.state.submitting}
              >
                Cancel?
              </Button>
            </div>
            <Button
              disabled={!this.props.stripe || this.state.submitting}
              type={'submit'}
              color={text}
              background={background}
            >
              Confirm?
            </Button>
          </div>
        </div>
      </form>
    )
  }
}

const InjectedStripePaymentForm = injectStripe(StripePaymentForm)

const PaymentForm = ({ apiKey, customerName, onCancelClick, onSubmit }) => (
  <StripeProvider apiKey={apiKey}>
    <Elements
      fonts={[{ cssSrc: 'https://fonts.googleapis.com/css?family=Exo+2' }]}
    >
      <InjectedStripePaymentForm
        customerName={customerName}
        onCancelClick={onCancelClick}
        onSubmit={onSubmit}
      />
    </Elements>
  </StripeProvider>
)

export default PaymentForm
