'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

type ProductDetailField = { key: string; value: string }

type CategoryFormData = {
  name: string
  description?: string
  meta_title?: string
  meta_description?: string
  cat_image?: FileList
  cat_banner?: FileList
  product_details: ProductDetailField[]
}

export default function CategoryForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      product_details: [{ key: '', value: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'product_details',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const onSubmit = async (data: CategoryFormData) => {
    const formData = new FormData()
    formData.append('name', data.name)
    if (data.description) formData.append('description', data.description)
    if (data.meta_title) formData.append('meta_title', data.meta_title)
    if (data.meta_description) formData.append('meta_description', data.meta_description)
    if (data.cat_image?.[0]) formData.append('cat_image', data.cat_image[0])
    if (data.cat_banner?.[0]) formData.append('cat_banner', data.cat_banner[0])
    formData.append('product_details', JSON.stringify(data.product_details))

    try {
      setIsSubmitting(true)
      await axios.post('http://localhost:8000/api/categories/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMessage('Category created successfully!')
    } catch (error: any) {
      console.error(error)
      setMessage('Failed to create category.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Name</Label>
            <Input {...register('name', { required: true })} />
            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...register('description')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Meta Title</Label>
              <Input {...register('meta_title')} />
            </div>
            <div>
              <Label>Meta Description</Label>
              <Input {...register('meta_description')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category Image</Label>
              <Input type="file" {...register('cat_image')} />
            </div>
            <div>
              <Label>Category Banner</Label>
              <Input type="file" {...register('cat_banner')} />
            </div>
          </div>

          <div>
            <Label className="text-lg">Product Details Fields</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <Input placeholder="Key" {...register(`product_details.${index}.key`)} />
                <Input placeholder="Value" {...register(`product_details.${index}.value`)} />
                <Button type="button" variant="destructive" onClick={() => remove(index)}>
                  Remove
                </Button>
              </div>
            ))}
            <Button type="button" onClick={() => append({ key: '', value: '' })}>
              Add Field
            </Button>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Create Category'}
          </Button>

          {message && <p className="text-sm text-center mt-2">{message}</p>}
        </form>
      </CardContent>
    </Card>
  )
}
