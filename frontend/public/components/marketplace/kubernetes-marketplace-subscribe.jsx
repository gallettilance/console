import * as React from 'react';
import PropTypes from 'prop-types';
import { Dropdown } from '../utils';
import Button from 'patternfly-react/dist/esm/components/Button/Button';
import CatalogItemHeader from 'patternfly-react-extensions/dist/esm/components/CatalogItemHeader/CatalogItemHeader';

import {k8sCreate, referenceForModel} from '../../module/k8s';
import {CatalogSourceConfigModel, PackageManifestModel} from '../../models';

class DropdownElement extends React.Component {
  constructor(props) {
    super(props);
  }
   render() {
    const { title, id, items, onChange } = this.props;
    return (
      <div className="co-marketplace-subscribe--dropdownelement">
        {title} <br/>
        <Dropdown
          title={title}
          id={id}
          items={items}
          dropDownClassName="dropdown--full-width"
          id="dropdown-selectbox"
          onChange={onChange}
        />
      </div>
    )
  }
}
class AdminSubscribe extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
      form: {
        dropdowns: {
          namespace: null,
          channel: null,
          strategy: null
        }
      }
    };
  }

  subscribe(targetNamespace) {
    // Subscribe to operator by creating catalogSourceConfig in a given namespace
    const {item, close} = this.props;
    const {name, packageId} = item;
    const catalogSourceConfig = {
      apiVersion: 'marketplace.redhat.com/v1alpha1',
      kind: 'CatalogSourceConfig',
      metadata: {
        name: `${name}`,
        namespace: "marketplace",
      },
      spec: {
        targetNamespace: `${targetNamespace}`,
        packages: `${packageId}`,
      },
    };

    // This returns a promise, should add some error checking on this
    k8sCreate(CatalogSourceConfigModel, catalogSourceConfig);

    close();
  };

  onChange = (selected, id) => {
    this.setState((prevState) => {
      const form = prevState.form;
      form.dropdowns[id] = selected;
      return {
        form: form
      };
    });
  };

  render () {
    const { item, close } = this.props;
    const { name, imgUrl, provider, description, version, certifiedLevel, healthIndex, repository, containerImage, createdAt, support } = item;

     // TODO: Load the namespaces from the cluster
    const form = [
      {
        title: "Namespace",
        id: "namespace",
        items: {
          default: "default",
          myproject: "myproject"
        }
      },
      {
        title: "Update Channel",
        id: "channel",
        items: {
          stable: "Stable",
          latest: "Latest"
        }
      },
      {
        title: "Update Strategy",
        id: "strategy",
        items: {
          automatic: "Automatic",
          manual: "Manual"
        }
      }
    ];

    return (
      <div className="co-marketplace-subscribe">
        <div className="co-marketplace-subscribe--header">
          <h1>Subscribe Service</h1>
          <p className="co-help-text">Select the namespace where you want to make the application available and select channel and update strategy.</p>
        </div>
        <div className="co-marketplace-subscribe--form">
          <div className="co-marketplace-subscribe--dropdowns">
             { form &&
              form.map((dropdown, index) => (
                <DropdownElement
                  key={`subscribe-dropdown-${dropdown.id}-${index}`}
                  id={dropdown.id}
                  title={dropdown.title}
                  items={dropdown.items}
                  onChange={(selected) => this.onChange(selected, dropdown.id)}
                />
              ))
            }
           </div>
          <div className="co-marketplace-subscribe--buttons">
            <Button bsStyle="primary" className="btn-cancel" onClick={() => this.subscribe(this.state.form.dropdowns.namespace)}>
              Subscribe
            </Button>
            <Button bsStyle="default" onClick={close}>
              Cancel
            </Button>
          </div>
        </div>
        <div className="co-marketplace-subscribe--description">
          <CatalogItemHeader
            className="long-description-test"
            iconImg={imgUrl}
            title={name}
            vendor={<span> {provider}</span>}
          />
          <div style={{ marginTop : '20px' }}>
            {description}
          </div>
        </div>
      </div>
    );
  }
 }
 export { AdminSubscribe };