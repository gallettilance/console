import * as React from 'react';
import PropTypes from 'prop-types';
import Button from 'patternfly-react/dist/esm/components/Button/Button';
import Modal from 'patternfly-react/dist/esm/components/Modal/Modal';
import CatalogItemHeader from 'patternfly-react-extensions/dist/esm/components/CatalogItemHeader/CatalogItemHeader';
import PropertiesSidePanel from 'patternfly-react-extensions/dist/esm/components/PropertiesSidePanel/PropertiesSidePanel';
import PropertyItem from 'patternfly-react-extensions/dist/esm/components/PropertiesSidePanel/PropertyItem';

const MarketplaceModalOverlay = (props) => {
  const { item, close /* openSubscribe */ } = props;
  const { name, imgUrl, provider, description, version, certifiedLevel, healthIndex, repository, containerImage, createdAt, support } = item;
  const notAvailable = <span className="properties-side-panel-pf-property-label">N/A</span>;
  return (
    <React.Fragment>
      <Modal show={true} className="right-side-modal-pf" bsSize={'lg'}>
        <Modal.Header>
          <CatalogItemHeader
            className="co-marketplace-modal__item-header"
            iconImg={imgUrl}
            title={name}
            vendor={<span> {provider}</span>}
          />
          <Modal.CloseButton onClick={close} />
        </Modal.Header>
        <Modal.Body>
          <div className="co-marketplace-modal__body">
            <PropertiesSidePanel>
              <Button bsStyle="primary" className="co-marketplace-modal__subscribe" /* onClick={ openSubscribe }*/ >
                Subscribe
              </Button>
              <PropertyItem label="Operator Version" value={version || notAvailable} />
              <PropertyItem label="Certified Level" value={certifiedLevel || notAvailable} />
              <PropertyItem label="Provider" value={provider || notAvailable} />
              <PropertyItem label="Health Index" value={healthIndex || notAvailable} />
              <PropertyItem label="Repository" value={repository || notAvailable} />
              <PropertyItem label="Container Image" value={containerImage || notAvailable} />
              <PropertyItem label="Created At" value={createdAt || notAvailable} />
              <PropertyItem label="Support" value={support || notAvailable} />
            </PropertiesSidePanel>
            <div className="co-marketplace-modal__item co-marketplace-modal__description">
              {description}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};
MarketplaceModalOverlay.propTypes = {
  size: PropTypes.string
};
MarketplaceModalOverlay.defaultProps = {
  size: 'default'
};
export { MarketplaceModalOverlay };
