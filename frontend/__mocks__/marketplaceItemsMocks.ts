export const marketplaceListPageProps = {
  loaded: true,
  loadError: {},
  packagemanifests: {
    data: [
      {
        metadata: {
          creationTimestamp: '',
          labels: {
            catalog: '',
            catalog-namespace: '',
            provider: '',
            provider-url: '',
          },
          name: '',
          namespace: '',
          selfLink: '',
        },
        spec: {},
        status: {
          catalogSource: '',
          catalogSourceNamespace: '',
          channels: [
            {
              currentCSV: '',
              currentCSVDesc: {
                annotations: {}, // This is where extra display info will be stored
                displayName: '',
                icon: [
                  {
                    base64data: '',
                    mediatype: '',
                  },
                ],
                provider: {
                  name: '',
                },
                version: '',
              },
            },
            name: 'alpha',
          ],
          defaultChannel: '',
          packageName: '',
          provider: {
            name: '',
          },
        },
      },
    ],
  }
};

export const marketplaceItems = {};
