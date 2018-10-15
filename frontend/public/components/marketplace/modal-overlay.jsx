import * as React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'patternfly-react';
import { CatalogItemHeader, PropertiesSidePanel, PropertyItem } from 'patternfly-react-extensions';

class MarketplaceModalOverlay extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    const {item, close /* openSubscribe */} = this.props;
    const {tileName, tileImgUrl, tileProvider, tileDescription, version, certifiedLevel, healthIndex, repository, containerImage, createdAt, support} = item;
    return (
      <React.Fragment>
        <Modal show={true} className="right-side-modal-pf" bsSize={'lg'}>
          <Modal.Header>
            <Modal.CloseButton onClick={close} />
          </Modal.Header>
          <Modal.Body>
            <CatalogItemHeader
              className="long-description-test"
              iconImg={tileImgUrl}
              title={tileName}
              vendor={<span> {tileProvider}</span>}
            />
            <div className="co-marketplace-modal">
              <div className="co-marketplace-modal--item co-marketplace-modal--properties__border">
                <Button bsStyle="primary" style={{ width: '100%' }} onClick={/* openSubscribe */}>
                  Subscribe
                </Button>
                <br />
                <br></br>
                <PropertiesSidePanel>
                  <PropertyItem key={'ver'} label={'Operator Version'} value={version} />
                  <PropertyItem key={'ver'} label={'Certified Level'} value={certifiedLevel} />
                  <PropertyItem key={'pro'} label={'Provider'} value={tileProvider} />
                  <PropertyItem key={'ver'} label={'Health Index'} value={healthIndex} />
                  <PropertyItem key={'ver'} label={'Repository'} value={repository} />
                  <PropertyItem key={'ver'} label={'Container Image'} value={containerImage} />
                  <PropertyItem key={'ver'} label={'Created At'} value={createdAt} />
                  <PropertyItem key={'ver'} label={'Support'} value={support} />
                </PropertiesSidePanel>
              </div>
              <div className="co-marketplace-modal--item co-marketplace-modal--description">
                {tileDescription}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    )};
}
MarketplaceModalOverlay.propTypes = {
  size: PropTypes.string
};
MarketplaceModalOverlay.defaultProps = {
  size: 'default'
};
export { MarketplaceModalOverlay };
