// lib/api/client.ts
import Cookies from 'js-cookie'

type RequestConfig = {
  params?: Record<string, any>
  headers?: Record<string, string>
  body?: any
}

class ApiClient {
  private baseUrl: string
  private defaultHeaders: Record<string, string>

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_DASHBOARD_API || ''
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private getAuthHeader(): Record<string, string> {
    const token = Cookies.get('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseUrl)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString())
        }
      })
    }

    return url.toString()
  }

  // GET (unchanged)
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await fetch(this.buildUrl(endpoint, config?.params), {
      method: 'GET',
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
        ...config?.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || `GET request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // POST
  async post<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'POST',
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
        ...config?.headers,
      },
      body: JSON.stringify(config?.body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || `POST request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // PUT
  async put<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'PUT',
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
        ...config?.headers,
      },
      body: JSON.stringify(config?.body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || `PUT request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // DELETE
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'DELETE',
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
        ...config?.headers,
      },
      body: config?.body ? JSON.stringify(config.body) : undefined,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || `DELETE request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // PATCH
  async patch<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await fetch(this.buildUrl(endpoint), {
      method: 'PATCH',
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
        ...config?.headers,
      },
      body: JSON.stringify(config?.body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || `PATCH request failed: ${response.statusText}`)
    }

    return response.json()
  }
}

export const apiClient = new ApiClient()
