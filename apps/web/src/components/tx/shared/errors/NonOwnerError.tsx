import ErrorMessage from '@/components/tx/ErrorMessage'

const NonOwnerError = () => {
  return (
    <ErrorMessage>
      You are currently not a signer of this multisig account and won&apos;t be able to submit this transaction.
    </ErrorMessage>
  )
}

export default NonOwnerError
