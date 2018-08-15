import React, { Component } from 'react';
import PropTypes from 'prop-types';
import connectContainer from 'redux-static';
import { Error, Confirm } from 'auth0-extension-ui';

import { userActions } from '../../../actions';
import getDialogMessage from './getDialogMessage';
import { getName } from '../../../utils/display';
import getErrorMessage from '../../../utils/getErrorMessage';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    removeBlocks: state.removeBlocks,
    settings: (state.settings.get('record') && state.settings.get('record').toJS().settings) || {},
    languageDictionary: state.languageDictionary
  });

  static actionsToProps = {
    ...userActions
  };

  static propTypes = {
    cancelRemoveBlocks: PropTypes.func.isRequired,
    removeUserBlocks: PropTypes.func.isRequired,
    removeBlocks: PropTypes.object.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.removeBlocks !== this.props.removeBlocks ||
      nextProps.languageDictionary !== this.props.languageDictionary;
  }

  onConfirm = () => {
    this.props.removeUserBlocks();
  };

  render() {
    const { cancelRemoveBlocks, settings } = this.props;
    const { user, error, requesting, loading } = this.props.removeBlocks.toJS();

    const userFields = settings.userFields || [];

    const languageDictionary = this.props.languageDictionary.get('record').toJS();

    const messageFormat = languageDictionary.removeBlocksDialogMessage ||
      'Do you really want to remove all Anomaly Detection blocks from {username}? ' +
      'After doing so the user will be able to sign in again.';
    const message = getDialogMessage(messageFormat, 'username',
      getName(user, userFields, languageDictionary));

    return (
      <Confirm
        title={languageDictionary.removeBlocksDialogTitle || "Remove User Blocks?"}
        show={requesting}
        loading={loading}
        confirmMessage={languageDictionary.dialogConfirmText}
        cancelMessage={languageDictionary.dialogCancelText}
        onCancel={cancelRemoveBlocks}
        closeLabel={languageDictionary.closeButtonText}
        onConfirm={this.onConfirm}>
        <Error title={languageDictionary.errorTitle} message={getErrorMessage(languageDictionary, error, settings.errorTranslator)} />
        <p>
          {message}
        </p>
      </Confirm>
    );
  }
});
