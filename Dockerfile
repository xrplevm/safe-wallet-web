FROM docker.io/library/node:22-alpine
RUN apk add --no-cache libc6-compat git python3 py3-pip make g++ libusb-dev eudev-dev linux-headers

WORKDIR /app
COPY . .

WORKDIR /app/apps/web

RUN corepack enable
RUN yarn config set httpTimeout 300000
RUN yarn install --immutable
RUN yarn after-install

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# `yarn serve` listens on REVERSE_PROXY_UI_PORT
ENV REVERSE_PROXY_UI_PORT=3000

EXPOSE 3000

# NEXT_PUBLIC_* values are compiled into the bundle, so the app is built at container start from the
# runtime env (Helm values). The brand check stops the container if Safe branding is in the build.
CMD ["sh", "-c", "yarn build && sh scripts/check-brand.sh out && yarn serve"]
