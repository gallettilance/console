import * as React from 'react';
import PropTypes from 'prop-types';

import Button from 'patternfly-react/dist/esm/components/Button/Button';
import Modal from 'patternfly-react/dist/esm/components/Modal/Modal';
import CatalogItemHeader from 'patternfly-react-extensions/dist/esm/components/CatalogItemHeader/CatalogItemHeader';
import PropertiesSidePanel from 'patternfly-react-extensions/dist/esm/components/PropertiesSidePanel/PropertiesSidePanel';
import PropertyItem from 'patternfly-react-extensions/dist/esm/components/PropertiesSidePanel/PropertyItem';

class MarketplaceModalOverlay extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    const {item, close /* openSubscribe */} = this.props;
    const {tileName, tileImgUrl, tileProvider, tileDescription, version, certifiedLevel, healthIndex, repository, containerImage, createdAt, support} = item;
    const notAvailable = <span className="properties-side-panel-pf-property-label">N/A</span>;
    return (
      <React.Fragment>
        <Modal show={true} className="right-side-modal-pf" bsSize={'lg'}>
          <Modal.Header>
            <CatalogItemHeader
              className="co-marketplace-modal--item-header"
              iconImg={tileImgUrl}
              title={tileName}
              vendor={<span> {tileProvider}</span>}
            />
            <Modal.CloseButton onClick={close} />
          </Modal.Header>
          <Modal.Body>
            <div className="co-marketplace-modal--body">
              <PropertiesSidePanel>
                <Button bsStyle="primary" className="co-marketplace-modal--subscribe" /* onClick={ openSubscribe }*/ >
                  Subscribe
                </Button>
                <PropertyItem label={'Operator Version'} value={version || notAvailable} />
                <PropertyItem label={'Certified Level'} value={certifiedLevel || notAvailable} />
                <PropertyItem label={'Provider'} value={tileProvider || notAvailable} />
                <PropertyItem label={'Health Index'} value={healthIndex || notAvailable} />
                <PropertyItem label={'Repository'} value={repository || notAvailable} />
                <PropertyItem label={'Container Image'} value={containerImage || notAvailable} />
                <PropertyItem label={'Created At'} value={createdAt || notAvailable} />
                <PropertyItem label={'Support'} value={support || notAvailable} />
              </PropertiesSidePanel>
              <div className="co-marketplace-modal--item co-marketplace-modal--description">
                {tileDescription}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}
MarketplaceModalOverlay.propTypes = {
  size: PropTypes.string
};
MarketplaceModalOverlay.defaultProps = {
  size: 'default'
};
export { MarketplaceModalOverlay };
