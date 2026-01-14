import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, useNavigate, useSearchParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { ClientOnly, IconButton, Skeleton, Span, defineConfig, createSystem, defaultConfig, ChakraProvider, CardRoot, CardBody, VStack, Heading, Field as Field$1, Input, Button, Box, AbsoluteCenter, Progress, EmptyState } from "@chakra-ui/react";
import { useTheme, ThemeProvider } from "next-themes";
import * as React from "react";
import { useState, useEffect } from "react";
import { LuMoon, LuSun } from "react-icons/lu";
import { Formik, Form, Field } from "formik";
import { BsRocketTakeoff } from "react-icons/bs";
import * as Yup from "yup";
import { IoMdArrowBack } from "react-icons/io";
import { Octokit } from "octokit";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function ColorModeProvider(props) {
  return /* @__PURE__ */ jsx(ThemeProvider, { attribute: "class", disableTransitionOnChange: true, ...props });
}
function useColorMode() {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme();
  const colorMode = forcedTheme || resolvedTheme;
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  return {
    colorMode,
    setColorMode: setTheme,
    toggleColorMode
  };
}
function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? /* @__PURE__ */ jsx(LuMoon, {}) : /* @__PURE__ */ jsx(LuSun, {});
}
React.forwardRef(function ColorModeButton2(props, ref) {
  const { toggleColorMode } = useColorMode();
  return /* @__PURE__ */ jsx(ClientOnly, { fallback: /* @__PURE__ */ jsx(Skeleton, { boxSize: "9" }), children: /* @__PURE__ */ jsx(
    IconButton,
    {
      onClick: toggleColorMode,
      variant: "ghost",
      "aria-label": "Toggle color mode",
      size: "sm",
      ref,
      ...props,
      css: {
        _icon: {
          width: "5",
          height: "5"
        }
      },
      children: /* @__PURE__ */ jsx(ColorModeIcon, {})
    }
  ) });
});
React.forwardRef(
  function LightMode2(props, ref) {
    return /* @__PURE__ */ jsx(
      Span,
      {
        color: "fg",
        display: "contents",
        className: "chakra-theme light",
        colorPalette: "gray",
        colorScheme: "light",
        ref,
        ...props
      }
    );
  }
);
React.forwardRef(
  function DarkMode2(props, ref) {
    return /* @__PURE__ */ jsx(
      Span,
      {
        color: "fg",
        display: "contents",
        className: "chakra-theme dark",
        colorPalette: "gray",
        colorScheme: "dark",
        ref,
        ...props
      }
    );
  }
);
const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        primary: { value: "{colors.brand.500}" },
        secondary: { value: "{colors.brand.300}" },
        brand: {
          "50": { value: "#fbeaef" },
          "100": { value: "#f7d4e0" },
          "200": { value: "#efa9c0" },
          "300": { value: "#e77ea1" },
          "400": { value: "#de5482" },
          "500": { value: "#d62963" },
          "600": { value: "#ab214f" },
          "700": { value: "#81183b" },
          "800": { value: "#561027" },
          "900": { value: "#2b0814" },
          "950": { value: "#1e060e" }
        }
      },
      fonts: {
        body: { value: "system-ui, sans-serif" }
      }
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.500}" },
          contrast: { value: "{colors.brand.100}" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.100}" },
          subtle: { value: "{colors.brand.200}" },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.brand.500}" }
        }
      }
    }
  }
});
const theme = createSystem(defaultConfig, config);
function Provider(props) {
  return /* @__PURE__ */ jsx(ChakraProvider, { value: theme, children: /* @__PURE__ */ jsx(ColorModeProvider, { ...props }) });
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Provider, {
    children: /* @__PURE__ */ jsx(Outlet, {})
  });
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const PickGameForm = ({ onSubmit }) => {
  const [initialValues, setInitialValues] = useState({
    repoUrl: "https://github.com/pdepjm/2024-o-tpjuego-bestiasalgoritmicas",
    branch: "main",
    main: "mainStickyBlocks"
  });
  const handleSubmit = (values, formikBag) => {
    const { owner, name } = parseGitHubUrl(values.repoUrl);
    const settings = {
      name,
      owner,
      branch: values.branch,
      main: values.main
    };
    onSubmit?.(settings, formikBag);
    setInitialValues({ ...initialValues });
  };
  return /* @__PURE__ */ jsx(
    Formik,
    {
      initialValues,
      onSubmit: handleSubmit,
      validationSchema,
      children: ({
        isValid,
        isSubmitting,
        errors,
        touched
      }) => {
        return /* @__PURE__ */ jsx(Form, { children: /* @__PURE__ */ jsx(CardRoot, { minW: "40vw", children: /* @__PURE__ */ jsx(CardBody, { children: /* @__PURE__ */ jsxs(VStack, { gap: 6, align: "stretch", children: [
          /* @__PURE__ */ jsx(Heading, { size: "lg", children: "Launch Your Game" }),
          /* @__PURE__ */ jsx(Field, { name: "repoUrl", children: ({ field }) => /* @__PURE__ */ jsxs(
            Field$1.Root,
            {
              required: true,
              invalid: !!errors.repoUrl && touched.repoUrl,
              children: [
                /* @__PURE__ */ jsx(Field$1.Label, { children: "GitHub Repository URL" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    ...field,
                    type: "url",
                    placeholder: "https://github.com/owner/repo"
                  }
                ),
                /* @__PURE__ */ jsx(Field$1.ErrorText, { children: errors.repoUrl })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(Field, { name: "branch", children: ({ field }) => /* @__PURE__ */ jsxs(
            Field$1.Root,
            {
              required: true,
              invalid: !!errors.branch && touched.branch,
              children: [
                /* @__PURE__ */ jsx(Field$1.Label, { children: "Branch" }),
                /* @__PURE__ */ jsx(Input, { ...field, type: "text", placeholder: "main" }),
                /* @__PURE__ */ jsx(Field$1.ErrorText, { children: errors.branch })
              ]
            }
          ) }),
          /* @__PURE__ */ jsx(Field, { name: "main", children: ({ field }) => /* @__PURE__ */ jsxs(
            Field$1.Root,
            {
              required: true,
              invalid: !!errors.main && touched.main,
              children: [
                /* @__PURE__ */ jsx(Field$1.Label, { children: "Main (.wpgm) file" }),
                /* @__PURE__ */ jsx(Input, { ...field, type: "text", placeholder: "main" }),
                /* @__PURE__ */ jsx(Field$1.ErrorText, { children: errors.main })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              type: "submit",
              disabled: !isValid || isSubmitting,
              colorPalette: "brand",
              color: "white",
              width: "full",
              children: [
                "Launch Game ",
                /* @__PURE__ */ jsx(BsRocketTakeoff, {})
              ]
            }
          )
        ] }) }) }) });
      }
    }
  );
};
const validationSchema = Yup.object().shape({
  repoUrl: Yup.string().required("Repository URL is required").url("Invalid URL").matches(
    /^(https?:\/\/)?(www\.)?github\.com\/.+\/.+$/,
    "Must be a valid GitHub repository URL"
  ),
  branch: Yup.string().required("Branch is required"),
  main: Yup.string().required("Main file is required")
});
const GITHUB_REPO_REGEX = /github\.com\/([^\/]+)\/([^\/]+)/;
const parseGitHubUrl = (url) => {
  try {
    const match = url.match(GITHUB_REPO_REGEX);
    if (match) {
      const owner = match[1];
      const repo = match[2].replace(/\.git$/, "");
      return { owner, name: repo };
    }
  } catch (error) {
    return { owner: "", name: "" };
  }
  return { owner: "", name: "" };
};
function meta$1({}) {
  return [{
    title: "Wollok Game"
  }, {
    name: "description",
    content: "Welcome to the Wollok Game runner app!"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  const navigate = useNavigate();
  const projectSelected = (settings, formikBag) => {
    const ghRepo = `${settings.owner}/${settings.name}`;
    const ghBranch = settings.branch;
    const main = settings.main;
    navigate(`/play?ghRepo=${encodeURIComponent(ghRepo)}&ghBranch=${encodeURIComponent(ghBranch)}&main=${encodeURIComponent(main)}`);
    formikBag.resetForm();
  };
  return /* @__PURE__ */ jsx(Box, {
    children: /* @__PURE__ */ jsx(AbsoluteCenter, {
      children: /* @__PURE__ */ jsx(PickGameForm, {
        onSubmit: projectSelected
      })
    })
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const Game = void 0;
function useWollokGameGithubProject() {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState({ loading: false });
  const [error, setError] = useState(null);
  const ghApi = new Octokit({
    // ToDo authenticate with github for higher rate limits
    userAgent: "Wollok Game Runner"
  });
  async function loadProject(args) {
    setLoading({ progress: 0, loading: true });
    const { branch: tree_sha, name: repo, owner, main } = args;
    try {
      const {
        data: { tree }
      } = await ghApi.request(
        "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
        {
          owner,
          repo,
          tree_sha,
          // or the specific branch you want to fetch
          recursive: "true"
        }
      );
      const sourceFiles = tree.filter(endsWithExtension(sourceFileExtensions));
      const imageFiles = tree.filter(endsWithExtension(imageFileExtensions));
      const soundFiles = tree.filter(endsWithExtension(soundFileExtensions));
      const totalFiles = sourceFiles.length + imageFiles.length + soundFiles.length;
      let fetchedFiles = 0;
      const reportProgress = () => {
        fetchedFiles++;
        setLoading({
          progress: Math.round(fetchedFiles / totalFiles * 100),
          loading: true
        });
      };
      const fetchFiles = repoFetcher(ghApi, args, reportProgress);
      setProject({
        sources: await fetchFiles("raw", sourceFiles, toSourceFile),
        main,
        description: `Game from ${owner}/${repo} on branch ${tree_sha}`,
        images: await fetchFiles(
          "base64",
          imageFiles,
          toMediaBase64File("image")
        ),
        sounds: await fetchFiles(
          "base64",
          soundFiles,
          toMediaBase64File("audio")
        )
      });
    } catch (error2) {
      setError(
        `Failed to load project: ${error2 instanceof Error ? error2.message : "Unknown error"}`
      );
    } finally {
      setLoading({ loading: false });
    }
  }
  function reset() {
    setProject(null);
    setError(null);
    setLoading({ loading: false });
  }
  return {
    loadProject,
    loadingState: loading,
    project,
    reset,
    error
  };
}
function repoFetcher(ghApi, { name, owner }, reportProgress) {
  return async function(fileFormat, filesToFetch, mapResponse) {
    const getFileContent = async (file, mediaType = "raw") => {
      return ghApi.rest.repos.getContent({
        owner,
        repo: name,
        path: file.path,
        mediaType: {
          format: mediaType
        }
      });
    };
    const fetchFilesPromises = filesToFetch.map(
      (f) => getFileContent(f, fileFormat).then((response) => {
        reportProgress();
        return mapResponse(f.path, response);
      })
    );
    return await Promise.all(fetchFilesPromises);
  };
}
function toMediaBase64File(mimeType) {
  return function(_path, file) {
    if (Array.isArray(file.data)) {
      throw new Error(`Expected file but got directory for file ${_path}`);
    }
    if (file.data.type !== "file") {
      throw new Error(
        `Expected file but got ${file.data.type} for file ${_path}`
      );
    }
    if (file.data.encoding !== "base64") {
      if (!file.data.download_url) {
        throw new Error(`Expected download_url for non-base64 file ${_path}`);
      }
      return {
        possiblePaths: [file.data.name, file.data.path],
        url: file.data.download_url
      };
    }
    return {
      possiblePaths: [file.data.name, file.data.path],
      url: `data:${mimeType}/${file.data.name.split(".").pop()};base64,${file.data.content}`
    };
  };
}
function toSourceFile(path, file) {
  if (typeof file.data !== "string") {
    throw new Error(
      `Expected raw file but got ${file.headers["content-type"]} for file ${path}`
    );
  }
  return {
    name: path,
    // May want some error handling here but the response
    // will be a string because of the mediaType format
    content: file.data
  };
}
function endsWithExtension(extensions) {
  return function(file) {
    return extensions.some((ext) => file.path.endsWith(`.${ext}`));
  };
}
const sourceFileExtensions = ["wlk", "wpgm", "wtest"];
const imageFileExtensions = ["png", "jpg", "jpeg", "gif"];
const soundFileExtensions = ["mp3", "wav", "ogg"];
function meta({}) {
  return [{
    title: "Play - Wollok Game"
  }, {
    name: "description",
    content: "Play your Wollok Game!"
  }];
}
const play = UNSAFE_withComponentProps(function Play() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    loadProject,
    loadingState,
    project,
    reset,
    error
  } = useWollokGameGithubProject();
  const clientSide = typeof window !== "undefined";
  const ghRepo = searchParams.get("ghRepo");
  const ghBranch = searchParams.get("ghBranch");
  const main = searchParams.get("main");
  useEffect(() => {
    if (ghRepo && ghBranch && main && !project && !loadingState.loading) {
      const [owner, name] = ghRepo.split("/");
      if (owner && name) {
        loadProject({
          owner,
          name,
          branch: ghBranch,
          main
        });
      }
    }
  }, [ghRepo, ghBranch, main, project, loadingState.loading, loadProject]);
  const handleGoBack = () => {
    reset();
    navigate(-1);
  };
  if (loadingState.loading) {
    return /* @__PURE__ */ jsx(Box, {
      children: /* @__PURE__ */ jsx(AbsoluteCenter, {
        children: /* @__PURE__ */ jsxs(Progress.Root, {
          min: 0,
          max: 100,
          defaultValue: 10,
          value: loadingState.progress,
          minW: 300,
          striped: true,
          animated: true,
          children: [/* @__PURE__ */ jsx(Progress.Label, {
            children: "Loading Assets..."
          }), /* @__PURE__ */ jsx(Progress.Track, {
            children: /* @__PURE__ */ jsx(Progress.Range, {})
          }), /* @__PURE__ */ jsxs(Progress.ValueText, {
            children: [loadingState.progress, "%"]
          })]
        })
      })
    });
  }
  if (error) {
    return /* @__PURE__ */ jsx(Box, {
      children: /* @__PURE__ */ jsx(AbsoluteCenter, {
        children: /* @__PURE__ */ jsxs("div", {
          className: "text-red-500",
          children: [/* @__PURE__ */ jsxs("p", {
            children: ["Error: ", error]
          }), /* @__PURE__ */ jsx(Button, {
            colorPalette: "brand",
            onClick: handleGoBack,
            mt: 4,
            children: "Go Back"
          })]
        })
      })
    });
  }
  if (!project) {
    return /* @__PURE__ */ jsx(Box, {
      children: /* @__PURE__ */ jsxs(AbsoluteCenter, {
        children: [/* @__PURE__ */ jsxs(EmptyState.Root, {
          children: [/* @__PURE__ */ jsx(EmptyState.Title, {
            children: "No project loaded"
          }), /* @__PURE__ */ jsx(EmptyState.Description, {
            children: "Please go back and select a project to play."
          })]
        }), /* @__PURE__ */ jsx(Button, {
          colorPalette: "brand",
          onClick: handleGoBack,
          mt: 4,
          children: "Go Back"
        })]
      })
    });
  }
  if (!clientSide) {
    return /* @__PURE__ */ jsx("div", {
      className: "flex-1 flex flex-col items-center justify-center pt-16 pb-4",
      children: /* @__PURE__ */ jsx("p", {
        className: "text-lg",
        children: "No access to browser API"
      })
    });
  }
  return /* @__PURE__ */ jsxs(VStack, {
    paddingX: "4rem",
    children: [/* @__PURE__ */ jsx(IconButton, {
      alignSelf: "start",
      "aria-label": "Go Back",
      size: "lg",
      marginY: "1rem",
      onClick: handleGoBack,
      children: /* @__PURE__ */ jsx(IoMdArrowBack, {})
    }), /* @__PURE__ */ jsx(Game, {
      settings: project
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: play,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-C5kJRZuX.js", "imports": ["/assets/chunk-JMJ3UQ3L-CPumaeMD.js", "/assets/index-BPqGaHTy.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-pTLKQL7T.js", "imports": ["/assets/chunk-JMJ3UQ3L-CPumaeMD.js", "/assets/index-BPqGaHTy.js", "/assets/iconBase-B4H0EjgV.js", "/assets/icon-button-ByHn2H5b.js", "/assets/field.anatomy-BGpNXzL6.js"], "css": ["/assets/root-DEjAZpEA.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-CUemSB43.js", "imports": ["/assets/chunk-JMJ3UQ3L-CPumaeMD.js", "/assets/iconBase-B4H0EjgV.js", "/assets/v-stack-BDeUGRCl.js", "/assets/field.anatomy-BGpNXzL6.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/play": { "id": "routes/play", "parentId": "root", "path": "/play", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/play-CJfVBXEb.js", "imports": ["/assets/chunk-JMJ3UQ3L-CPumaeMD.js", "/assets/iconBase-B4H0EjgV.js", "/assets/v-stack-BDeUGRCl.js", "/assets/icon-button-ByHn2H5b.js", "/assets/index-BPqGaHTy.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-7a05ae3b.js", "version": "7a05ae3b", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/play": {
    id: "routes/play",
    parentId: "root",
    path: "/play",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
