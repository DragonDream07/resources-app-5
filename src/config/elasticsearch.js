import config from './index.js';

const elasticsearchConfig = {
  node: config.elasticsearch.url,
  ...(config.elasticsearch.username && config.elasticsearch.password
    ? {
        auth: {
          username: config.elasticsearch.username,
          password: config.elasticsearch.password,
        },
      }
    : {}),
};

export default elasticsearchConfig;
