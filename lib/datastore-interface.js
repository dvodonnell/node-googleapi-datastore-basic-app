(function(mod){

    var DStoreInterface = function(gapis) {

        this.gapis = gapis;

        this.credentials = null;
        this.ds = null;
        this.project = null;

    };

    DStoreInterface.prototype = {

        setProjectID : function(projectID) {
            this.project = projectID;
        },

        setCredentials : function(credentials) {

            var auth = new this.gapis.auth.JWT(
                credentials.client_email,
                null,
                credentials.private_key,
                [
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/datastore'
                ]
            );

            this.credentials = auth;

            this.ds = this.gapis.datastore({
                version: 'v1beta2',
                auth: auth,
                projectId: this.project,
                params: {datasetId: this.project}
            });

        },

        authorize : function(successCB, failureCB) {

            var self = this;

            if (this.credentials !== null) {

                this.credentials.authorize(function(jwtErr) {
                    if (jwtErr) {
                        if (failure) {
                            failureCB(jwtErr);
                        }
                    } else {
                        successCB();
                    }
                });

            }

        },

        query : function(kind, filters, callback) {

            var query = {
                datasetId: 'skilful-grove-110818',
                resource: {
                    query: {
                        kinds: [{name: kind}]
                    }
                }
            };

            if (filters) {
                query.resource.query['filter'] = {
                    compositeFilter : {
                        operator : 'AND',
                        filters : filters
                    }
                }
            }

            this.ds.datasets.runQuery(query, callback);

        },

        insert : function(kind, params, callback) {

            var entity = {
                key : {
                    path : [
                        {
                            kind : 'whatevs'
                        }
                    ]
                },
                properties: params
            };

            var commit = {
                resource: {
                    mutation: {
                        insertAutoId: [entity]
                    },
                    mode: 'NON_TRANSACTIONAL'
                }
            };

            this.ds.datasets.commit(commit, callback);

        }

    };

    mod.exports = DStoreInterface;

})(module);