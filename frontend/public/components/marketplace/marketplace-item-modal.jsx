import * as React from 'react';
import PropTypes from 'prop-types';
import {Button} from 'patternfly-react/dist/esm/components/Button';
import {Modal} from 'patternfly-react/dist/esm/components/Modal';
import {CatalogItemHeader} from 'patternfly-react-extensions/dist/esm/components/CatalogItemHeader';
import {PropertiesSidePanel, PropertyItem} from 'patternfly-react-extensions/dist/esm/components/PropertiesSidePanel';

import {AdminSubscribe} from './marketplace-subscribe';

class MarketplaceItemModal extends React.Component {
  constructor() {
    super();
    this.state = {
      showSubscribe: false
    };
  }
  closeSubscribe() {
    const {close} = this.props;
    this.setState({
      showSubscribe : false
    });
    close();
  }
  openSubscribe() {
    this.setState({
      showSubscribe : true
    })
  }
  
  render() {
    const { showSubscribe } = this.state;
    const { item, close } = this.props;
    const { itemName, itemImgUrl, provider, description, version, certifiedLevel, healthIndex, repository, containerImage, createdAt, support } = item;
    const MarketplaceProperty = ({label, value}) => {
      return <PropertyItem label={label} value={value || notAvailable} />;
    };
    const notAvailable = <span className="properties-side-panel-pf-property-label">N/A</span>;
    return ( 
      showSubscribe ?
      <Modal show={true} className="right-side-modal-pf" bsSize={'lg'}>
        <Modal.Header>
          <Modal.CloseButton onClick={close} />
        </Modal.Header>
        <Modal.Body>
          <AdminSubscribe item={item} close={() => this.closeSubscribe()} subscribe={/* TODO */}/>
        </Modal.Body>
      </ Modal>
      :
      <Modal show={true} className="right-side-modal-pf" bsSize={'lg'}>
        <Modal.Header>
          <CatalogItemHeader
            className="co-marketplace-modal__item-header"
            iconImg={itemImgUrl}
            title={itemName}
            vendor={<span> {provider}</span>}
          />
          <Modal.CloseButton onClick={close} />
        </Modal.Header>
        <Modal.Body>
          <div className="co-marketplace-modal__body">
            <PropertiesSidePanel>
              <Button bsStyle="primary" className="co-marketplace-modal__subscribe" onClick={ () => this.openSubscribe() } >
                  Subscribe
              </Button>
              <MarketplaceProperty label="Operator Version" value={version} />
              <MarketplaceProperty label="Certified Level" value={certifiedLevel} />
              <MarketplaceProperty label="Provider" value={provider} />
              <MarketplaceProperty label="Health Index" value={healthIndex} />
              <MarketplaceProperty label="Repository" value={repository} />
              <MarketplaceProperty label="Container Image" value={containerImage} />
              <MarketplaceProperty label="Created At" value={createdAt} />
              <MarketplaceProperty label="Support" value={support} />
            </PropertiesSidePanel>
            <div className="co-marketplace-modal__item co-marketplace-modal__description">
              {description}
            </div>
          </div>
        </Modal.Body>
    </Modal>
    )
  };
}
MarketplaceItemModal.propTypes = {
  size: PropTypes.string
};
MarketplaceItemModal.defaultProps = {
  size: 'default'
};
export { MarketplaceItemModal };
