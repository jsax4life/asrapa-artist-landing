interface GoogleCredentialResponse {
  credential: string;
}

interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: GoogleCredentialResponse) => void;
          auto_select?: boolean;
        }) => void;
        renderButton: (
          parent: HTMLElement,
          options: Record<string, string | number | boolean>
        ) => void;
        prompt: () => void;
      };
    };
  };
  FB?: {
    init: (params: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void;
    login: (
      callback: (response: {
        authResponse?: { accessToken: string };
        status?: string;
      }) => void,
      options: { scope: string; return_scopes?: boolean }
    ) => void;
  };
  fbAsyncInit?: () => void;
}

export {};
