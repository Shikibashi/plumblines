/** Plumblines permits existing block removal, but never creates new blocks. */
export const CAN_CREATE_BLOCKS = false

/** Reject before protocol writes or optimistic cache changes. */
export function assertBlockCreationAllowed(): void {
  if (!CAN_CREATE_BLOCKS) {
    throw new Error(
      'Plumblines does not create account blocks or blocking-list subscriptions',
    )
  }
}
